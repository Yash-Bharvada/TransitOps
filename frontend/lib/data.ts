export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired'
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended'
export type TripStatus = 'Draft' | 'Pending' | 'Dispatched' | 'Completed' | 'Cancelled'
export type MaintenanceStatus = 'Pending' | 'In Progress' | 'Completed'
export type ExpenseType = 'Toll' | 'Parking' | 'Maintenance' | 'Other'

export interface Vehicle {
  id: string
  registration: string
  name: string
  type: 'Truck' | 'Van' | 'Pickup' | 'Sedan'
  maxCapacityKg: number
  odometerKm: number
  status: VehicleStatus
  acquisitionCost: number
  region: 'North' | 'South' | 'East' | 'West'
}

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseCategory: string
  licenseExpiry: string
  contact: string
  safetyScore: number
  status: DriverStatus
}

export interface Trip {
  id: string
  driver: string
  vehicle: string
  source: string
  destination: string
  cargoWeightKg: number
  distanceKm: number
  status: TripStatus
  date: string
}

export interface MaintenanceRecord {
  id: string
  vehicle: string
  description: string
  cost: number
  startDate: string
  endDate: string | null
  status: MaintenanceStatus
}

export interface FuelLog {
  id: string
  vehicle: string
  date: string
  liters: number
  cost: number
  odometerKm: number
}

export interface Expense {
  id: string
  description: string
  type: ExpenseType
  amount: number
  date: string
  associatedWith: string
}

export const vehicles: Vehicle[] = [
  { id: 'VH-001', registration: 'TX-4821-KL', name: 'Volvo FH16', type: 'Truck', maxCapacityKg: 24000, odometerKm: 182450, status: 'Available', acquisitionCost: 165000, region: 'North' },
  { id: 'VH-002', registration: 'TX-1093-MN', name: 'Ford Transit 350', type: 'Van', maxCapacityKg: 1800, odometerKm: 94320, status: 'On Trip', acquisitionCost: 48000, region: 'South' },
  { id: 'VH-003', registration: 'TX-7745-PQ', name: 'Freightliner Cascadia', type: 'Truck', maxCapacityKg: 22500, odometerKm: 240880, status: 'In Shop', acquisitionCost: 158000, region: 'East' },
  { id: 'VH-004', registration: 'TX-3382-RS', name: 'Chevrolet Silverado 2500', type: 'Pickup', maxCapacityKg: 1600, odometerKm: 61240, status: 'Available', acquisitionCost: 52000, region: 'West' },
  { id: 'VH-005', registration: 'TX-9014-TU', name: 'Mercedes Sprinter', type: 'Van', maxCapacityKg: 2100, odometerKm: 78650, status: 'On Trip', acquisitionCost: 61000, region: 'North' },
  { id: 'VH-006', registration: 'TX-5567-VW', name: 'Kenworth T680', type: 'Truck', maxCapacityKg: 23000, odometerKm: 310420, status: 'Available', acquisitionCost: 172000, region: 'South' },
  { id: 'VH-007', registration: 'TX-2208-XY', name: 'Toyota Camry', type: 'Sedan', maxCapacityKg: 450, odometerKm: 45230, status: 'Available', acquisitionCost: 32000, region: 'East' },
  { id: 'VH-008', registration: 'TX-6631-AB', name: 'Ram 3500', type: 'Pickup', maxCapacityKg: 2000, odometerKm: 88710, status: 'In Shop', acquisitionCost: 58000, region: 'West' },
  { id: 'VH-009', registration: 'TX-8890-CD', name: 'Peterbilt 579', type: 'Truck', maxCapacityKg: 23500, odometerKm: 402350, status: 'Retired', acquisitionCost: 149000, region: 'North' },
  { id: 'VH-010', registration: 'TX-4416-EF', name: 'Ford Transit 250', type: 'Van', maxCapacityKg: 1500, odometerKm: 120540, status: 'On Trip', acquisitionCost: 44000, region: 'South' },
]

export const drivers: Driver[] = [
  { id: 'DR-001', name: 'Marcus Webb', licenseNumber: 'CDL-582910', licenseCategory: 'Class A', licenseExpiry: '2027-03-15', contact: '(555) 210-4482', safetyScore: 94, status: 'Available' },
  { id: 'DR-002', name: 'Elena Vasquez', licenseNumber: 'CDL-771034', licenseCategory: 'Class A', licenseExpiry: '2026-08-02', contact: '(555) 318-9920', safetyScore: 88, status: 'On Trip' },
  { id: 'DR-003', name: 'James Okafor', licenseNumber: 'CDL-449218', licenseCategory: 'Class B', licenseExpiry: '2026-07-28', contact: '(555) 402-1183', safetyScore: 91, status: 'On Trip' },
  { id: 'DR-004', name: 'Priya Raman', licenseNumber: 'CDL-903342', licenseCategory: 'Class A', licenseExpiry: '2028-01-19', contact: '(555) 227-6641', safetyScore: 97, status: 'Available' },
  { id: 'DR-005', name: 'Tom Kowalski', licenseNumber: 'CDL-118576', licenseCategory: 'Class B', licenseExpiry: '2026-09-05', contact: '(555) 509-3327', safetyScore: 76, status: 'Off Duty' },
  { id: 'DR-006', name: 'Aisha Bello', licenseNumber: 'CDL-664209', licenseCategory: 'Class A', licenseExpiry: '2027-11-30', contact: '(555) 613-8850', safetyScore: 92, status: 'Available' },
  { id: 'DR-007', name: 'Diego Fuentes', licenseNumber: 'CDL-337815', licenseCategory: 'Class C', licenseExpiry: '2026-07-20', contact: '(555) 720-1145', safetyScore: 83, status: 'On Trip' },
  { id: 'DR-008', name: 'Sarah Lindqvist', licenseNumber: 'CDL-892467', licenseCategory: 'Class A', licenseExpiry: '2027-06-14', contact: '(555) 834-5568', safetyScore: 89, status: 'Available' },
  { id: 'DR-009', name: 'Ray Thompson', licenseNumber: 'CDL-205993', licenseCategory: 'Class B', licenseExpiry: '2026-12-08', contact: '(555) 941-2276', safetyScore: 58, status: 'Suspended' },
  { id: 'DR-010', name: 'Mei-Ling Chen', licenseNumber: 'CDL-550128', licenseCategory: 'Class A', licenseExpiry: '2028-04-22', contact: '(555) 156-7794', safetyScore: 95, status: 'Off Duty' },
]

export const trips: Trip[] = [
  { id: 'TR-1042', driver: 'Elena Vasquez', vehicle: 'TX-1093-MN', source: 'Dallas, TX', destination: 'Houston, TX', cargoWeightKg: 1450, distanceKm: 385, status: 'Dispatched', date: '2026-07-11' },
  { id: 'TR-1041', driver: 'James Okafor', vehicle: 'TX-9014-TU', source: 'Austin, TX', destination: 'San Antonio, TX', cargoWeightKg: 1800, distanceKm: 128, status: 'Dispatched', date: '2026-07-11' },
  { id: 'TR-1040', driver: 'Diego Fuentes', vehicle: 'TX-4416-EF', source: 'Fort Worth, TX', destination: 'El Paso, TX', cargoWeightKg: 1200, distanceKm: 930, status: 'Dispatched', date: '2026-07-10' },
  { id: 'TR-1039', driver: 'Marcus Webb', vehicle: 'TX-4821-KL', source: 'Houston, TX', destination: 'New Orleans, LA', cargoWeightKg: 18500, distanceKm: 560, status: 'Completed', date: '2026-07-09' },
  { id: 'TR-1038', driver: 'Priya Raman', vehicle: 'TX-5567-VW', source: 'Dallas, TX', destination: 'Oklahoma City, OK', cargoWeightKg: 20100, distanceKm: 330, status: 'Completed', date: '2026-07-08' },
  { id: 'TR-1037', driver: 'Aisha Bello', vehicle: 'TX-3382-RS', source: 'San Antonio, TX', destination: 'Laredo, TX', cargoWeightKg: 950, distanceKm: 250, status: 'Completed', date: '2026-07-08' },
  { id: 'TR-1036', driver: 'Sarah Lindqvist', vehicle: 'TX-4821-KL', source: 'Austin, TX', destination: 'Dallas, TX', cargoWeightKg: 16800, distanceKm: 314, status: 'Pending', date: '2026-07-13' },
  { id: 'TR-1035', driver: 'Marcus Webb', vehicle: 'TX-5567-VW', source: 'Houston, TX', destination: 'Corpus Christi, TX', cargoWeightKg: 19200, distanceKm: 335, status: 'Pending', date: '2026-07-14' },
  { id: 'TR-1034', driver: 'Tom Kowalski', vehicle: 'TX-6631-AB', source: 'El Paso, TX', destination: 'Phoenix, AZ', cargoWeightKg: 1500, distanceKm: 690, status: 'Cancelled', date: '2026-07-07' },
  { id: 'TR-1033', driver: 'Mei-Ling Chen', vehicle: 'TX-4821-KL', source: 'Dallas, TX', destination: 'Memphis, TN', cargoWeightKg: 21000, distanceKm: 730, status: 'Completed', date: '2026-07-06' },
  { id: 'TR-1032', driver: 'Priya Raman', vehicle: 'TX-2208-XY', source: 'Austin, TX', destination: 'Houston, TX', cargoWeightKg: 300, distanceKm: 265, status: 'Completed', date: '2026-07-05' },
  { id: 'TR-1031', driver: 'Elena Vasquez', vehicle: 'TX-1093-MN', source: 'San Antonio, TX', destination: 'Austin, TX', cargoWeightKg: 1350, distanceKm: 128, status: 'Completed', date: '2026-07-04' },
  { id: 'TR-1030', driver: 'Aisha Bello', vehicle: 'TX-5567-VW', source: 'Fort Worth, TX', destination: 'Little Rock, AR', cargoWeightKg: 17400, distanceKm: 520, status: 'Draft', date: '2026-07-15' },
  { id: 'TR-1029', driver: 'Sarah Lindqvist', vehicle: 'TX-3382-RS', source: 'Houston, TX', destination: 'Galveston, TX', cargoWeightKg: 800, distanceKm: 82, status: 'Draft', date: '2026-07-16' },
  { id: 'TR-1028', driver: 'James Okafor', vehicle: 'TX-9014-TU', source: 'Dallas, TX', destination: 'Shreveport, LA', cargoWeightKg: 1900, distanceKm: 305, status: 'Cancelled', date: '2026-07-03' },
]

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'MT-201', vehicle: 'TX-7745-PQ', description: 'Engine overhaul and turbo replacement', cost: 8400, startDate: '2026-07-08', endDate: null, status: 'In Progress' },
  { id: 'MT-202', vehicle: 'TX-6631-AB', description: 'Brake pad replacement and rotor resurfacing', cost: 1250, startDate: '2026-07-10', endDate: null, status: 'In Progress' },
  { id: 'MT-203', vehicle: 'TX-4821-KL', description: 'Scheduled 180k km service', cost: 950, startDate: '2026-07-15', endDate: null, status: 'Pending' },
  { id: 'MT-204', vehicle: 'TX-2208-XY', description: 'Tire rotation and wheel alignment', cost: 320, startDate: '2026-07-02', endDate: '2026-07-02', status: 'Completed' },
  { id: 'MT-205', vehicle: 'TX-5567-VW', description: 'Transmission fluid flush', cost: 680, startDate: '2026-06-28', endDate: '2026-06-29', status: 'Completed' },
  { id: 'MT-206', vehicle: 'TX-1093-MN', description: 'AC compressor repair', cost: 1140, startDate: '2026-06-24', endDate: '2026-06-26', status: 'Completed' },
  { id: 'MT-207', vehicle: 'TX-9014-TU', description: 'Suspension bushing replacement', cost: 890, startDate: '2026-07-18', endDate: null, status: 'Pending' },
  { id: 'MT-208', vehicle: 'TX-3382-RS', description: 'Oil change and filter replacement', cost: 180, startDate: '2026-06-20', endDate: '2026-06-20', status: 'Completed' },
]

export const fuelLogs: FuelLog[] = [
  { id: 'FL-501', vehicle: 'TX-4821-KL', date: '2026-07-11', liters: 420, cost: 588, odometerKm: 182450 },
  { id: 'FL-502', vehicle: 'TX-1093-MN', date: '2026-07-11', liters: 65, cost: 91, odometerKm: 94320 },
  { id: 'FL-503', vehicle: 'TX-9014-TU', date: '2026-07-10', liters: 72, cost: 101, odometerKm: 78650 },
  { id: 'FL-504', vehicle: 'TX-5567-VW', date: '2026-07-09', liters: 445, cost: 623, odometerKm: 310420 },
  { id: 'FL-505', vehicle: 'TX-4416-EF', date: '2026-07-09', liters: 58, cost: 81, odometerKm: 120540 },
  { id: 'FL-506', vehicle: 'TX-3382-RS', date: '2026-07-08', liters: 88, cost: 123, odometerKm: 61240 },
  { id: 'FL-507', vehicle: 'TX-2208-XY', date: '2026-07-07', liters: 42, cost: 59, odometerKm: 45230 },
  { id: 'FL-508', vehicle: 'TX-4821-KL', date: '2026-07-05', liters: 410, cost: 574, odometerKm: 181120 },
  { id: 'FL-509', vehicle: 'TX-6631-AB', date: '2026-07-04', liters: 95, cost: 133, odometerKm: 88710 },
  { id: 'FL-510', vehicle: 'TX-1093-MN', date: '2026-07-03', liters: 61, cost: 85, odometerKm: 93650 },
  { id: 'FL-511', vehicle: 'TX-5567-VW', date: '2026-07-01', liters: 430, cost: 602, odometerKm: 308900 },
  { id: 'FL-512', vehicle: 'TX-9014-TU', date: '2026-06-30', liters: 68, cost: 95, odometerKm: 77810 },
]

export const expenses: Expense[] = [
  { id: 'EX-301', description: 'I-45 toll plaza - Houston corridor', type: 'Toll', amount: 42.5, date: '2026-07-11', associatedWith: 'TR-1042' },
  { id: 'EX-302', description: 'Overnight parking - Austin depot', type: 'Parking', amount: 28, date: '2026-07-11', associatedWith: 'TX-9014-TU' },
  { id: 'EX-303', description: 'Emergency tire patch en route', type: 'Maintenance', amount: 145, date: '2026-07-10', associatedWith: 'TR-1040' },
  { id: 'EX-304', description: 'Weigh station fees', type: 'Other', amount: 35, date: '2026-07-09', associatedWith: 'TR-1039' },
  { id: 'EX-305', description: 'NTTA toll charges - Dallas loop', type: 'Toll', amount: 67.25, date: '2026-07-08', associatedWith: 'TR-1038' },
  { id: 'EX-306', description: 'Secure lot parking - San Antonio', type: 'Parking', amount: 32, date: '2026-07-08', associatedWith: 'TX-3382-RS' },
  { id: 'EX-307', description: 'Windshield wiper replacement', type: 'Maintenance', amount: 48, date: '2026-07-07', associatedWith: 'TX-2208-XY' },
  { id: 'EX-308', description: 'Driver lodging - El Paso overnight', type: 'Other', amount: 96, date: '2026-07-07', associatedWith: 'TR-1040' },
  { id: 'EX-309', description: 'Hardy toll road charges', type: 'Toll', amount: 22.75, date: '2026-07-05', associatedWith: 'TR-1032' },
  { id: 'EX-310', description: 'Truck wash and detailing', type: 'Other', amount: 85, date: '2026-07-04', associatedWith: 'TX-4821-KL' },
]

export const fuelTrend = [
  { month: 'Feb', liters: 2140 },
  { month: 'Mar', liters: 2380 },
  { month: 'Apr', liters: 2210 },
  { month: 'May', liters: 2560 },
  { month: 'Jun', liters: 2420 },
  { month: 'Jul', liters: 2254 },
]

export const costByVehicle = [
  { vehicle: 'TX-4821-KL', cost: 12480 },
  { vehicle: 'TX-5567-VW', cost: 11250 },
  { vehicle: 'TX-7745-PQ', cost: 9840 },
  { vehicle: 'TX-1093-MN', cost: 5320 },
  { vehicle: 'TX-9014-TU', cost: 4870 },
]

export const expenseBreakdown = [
  { category: 'Fuel', amount: 28450, fill: 'var(--color-chart-3)' },
  { category: 'Maintenance', amount: 13810, fill: 'var(--color-chart-2)' },
  { category: 'Other', amount: 2970, fill: 'var(--color-chart-4)' },
]

export const reportRows = [
  { vehicle: 'TX-4821-KL', distance: 8420, fuel: 3120, fuelCost: 4368, maintCost: 950, totalCost: 5318, roi: 2.8 },
  { vehicle: 'TX-5567-VW', distance: 7850, fuel: 2960, fuelCost: 4144, maintCost: 680, totalCost: 4824, roi: 2.6 },
  { vehicle: 'TX-1093-MN', distance: 5240, fuel: 620, fuelCost: 868, maintCost: 1140, totalCost: 2008, roi: 2.4 },
  { vehicle: 'TX-9014-TU', distance: 4980, fuel: 590, fuelCost: 826, maintCost: 890, totalCost: 1716, roi: 2.3 },
  { vehicle: 'TX-4416-EF', distance: 4310, fuel: 505, fuelCost: 707, maintCost: 0, totalCost: 707, roi: 2.5 },
  { vehicle: 'TX-3382-RS', distance: 3120, fuel: 410, fuelCost: 574, maintCost: 500, totalCost: 1074, roi: 2.1 },
  { vehicle: 'TX-6631-AB', distance: 2840, fuel: 385, fuelCost: 539, maintCost: 1250, totalCost: 1789, roi: 1.8 },
  { vehicle: 'TX-2208-XY', distance: 2610, fuel: 210, fuelCost: 294, maintCost: 368, totalCost: 662, roi: 2.2 },
]

export const locations = [
  'Dallas, TX', 'Houston, TX', 'Austin, TX', 'San Antonio, TX', 'Fort Worth, TX',
  'El Paso, TX', 'Corpus Christi, TX', 'Laredo, TX', 'Galveston, TX',
  'Oklahoma City, OK', 'New Orleans, LA', 'Phoenix, AZ', 'Memphis, TN',
  'Little Rock, AR', 'Shreveport, LA',
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value)
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
