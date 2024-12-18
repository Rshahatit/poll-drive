import React from 'react';
import { Clock, MapPin, Car, DollarSign, X } from 'lucide-react';
import type { VotingLocation } from '../../types';

interface RideBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: VotingLocation;
  onConfirm: (time: string, tipAmount: number) => void;
}

export function RideBookingModal({ isOpen, onClose, location, onConfirm }: RideBookingModalProps) {
  const [selectedTime, setSelectedTime] = React.useState('');
  const [tipAmount, setTipAmount] = React.useState(5);

  if (!isOpen) return null;

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
  ];

  const handleConfirm = () => {
    if (selectedTime) {
      onConfirm(selectedTime, tipAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">Confirm Your Ride</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Pickup Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm rounded-md border ${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <Clock className="h-4 w-4 inline-block mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Tip (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  {[5, 10, 15, 20].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`p-2 text-sm rounded-md border ${
                        tipAmount === amount
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <DollarSign className="h-4 w-4 inline-block" />
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Base Ride</span>
                    <span>Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Driver Tip</span>
                    <span>${tipAmount}.00</span>
                  </div>
                  <div className="flex items-center justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${tipAmount}.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedTime}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  selectedTime
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Car className="h-4 w-4 inline-block mr-1" />
                Confirm Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}