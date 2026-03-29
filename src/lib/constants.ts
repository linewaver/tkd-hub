export const BELT_RANKS = [
  { value: "WHITE", label: "White", color: "bg-gray-100 text-gray-800" },
  { value: "YELLOW", label: "Yellow", color: "bg-yellow-100 text-yellow-800" },
  { value: "GREEN", label: "Green", color: "bg-green-100 text-green-800" },
  { value: "BLUE", label: "Blue", color: "bg-blue-100 text-blue-800" },
  { value: "RED", label: "Red", color: "bg-red-100 text-red-800" },
  { value: "BLACK_1DAN", label: "Black 1st Dan", color: "bg-gray-900 text-white" },
  { value: "BLACK_2DAN", label: "Black 2nd Dan", color: "bg-gray-900 text-white" },
  { value: "BLACK_3DAN", label: "Black 3rd Dan", color: "bg-gray-900 text-white" },
  { value: "BLACK_4DAN", label: "Black 4th Dan", color: "bg-gray-900 text-white" },
  { value: "BLACK_5DAN", label: "Black 5th Dan", color: "bg-gray-900 text-white" },
  { value: "POOM_1", label: "Poom 1st", color: "bg-red-900 text-white" },
  { value: "POOM_2", label: "Poom 2nd", color: "bg-red-900 text-white" },
  { value: "POOM_3", label: "Poom 3rd", color: "bg-red-900 text-white" },
] as const;

export function getBeltInfo(rank: string) {
  return BELT_RANKS.find((b) => b.value === rank) ?? BELT_RANKS[0];
}

export const MEMBER_STATUS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
] as const;

export const PAYMENT_STATUS = [
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "REFUNDED", label: "Refunded" },
] as const;
