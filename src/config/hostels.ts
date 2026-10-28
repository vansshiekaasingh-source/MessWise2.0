export interface Hostel {
  id: string;
  name: string;
  shortCode: string;
  type: 'boys' | 'girls';
  messId: string;
  capacity: number;
  notes: string;
}

export interface RefectoryMess {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export const mnnitMesses: RefectoryMess[] = [
  { id: 'mess-svh', name: 'Swami Vivekananda Mega Mess', location: 'SVH Ground Floor Complex', capacity: 900 },
  { id: 'mess-central-boys', name: 'Patel-Tilak Central Refectory', location: 'Central Boys Quadrangle', capacity: 750 },
  { id: 'mess-tandon', name: 'PD Tandon & Malaviya Combined Mess', location: 'Tandon Quadrangle', capacity: 600 },
  { id: 'mess-girls-composite', name: 'Girls Hostels Composite Refectory', location: 'SNGH-KNGH Common Dining Block', capacity: 650 }
];

export const mnnitHostels: Hostel[] = [
  // 8 Boys Hostels (Addendum A2.1)
  { id: 'h-svh', name: 'Swami Vivekananda Hostel', shortCode: 'SVH', type: 'boys', messId: 'mess-svh', capacity: 850, notes: '1st Year UG (Multi-storey, 3-Seater)' },
  { id: 'h-patel', name: 'Sardar Vallabhbhai Patel Hostel', shortCode: 'Patel', type: 'boys', messId: 'mess-central-boys', capacity: 420, notes: '2nd & 3rd Year B.Tech' },
  { id: 'h-tilak', name: 'Bal Gangadhar Tilak Hostel', shortCode: 'Tilak', type: 'boys', messId: 'mess-central-boys', capacity: 380, notes: '2nd & 3rd Year B.Tech' },
  { id: 'h-tandon', name: 'Purushottam Das Tandon Hostel', shortCode: 'PD Tandon', type: 'boys', messId: 'mess-tandon', capacity: 320, notes: 'Senior B.Tech & M.Tech' },
  { id: 'h-malaviya', name: 'Pt. Madan Mohan Malaviya Hostel', shortCode: 'Malaviya', type: 'boys', messId: 'mess-tandon', capacity: 300, notes: 'Senior B.Tech' },
  { id: 'h-tagore', name: 'Kaviguru Rabindranath Tagore Hostel', shortCode: 'Tagore', type: 'boys', messId: 'mess-central-boys', capacity: 350, notes: 'Final Year B.Tech' },
  { id: 'h-raman', name: 'Sir C.V. Raman Hostel', shortCode: 'Raman', type: 'boys', messId: 'mess-tandon', capacity: 280, notes: 'Postgraduate & PhD Scholars' },
  { id: 'h-bh8', name: 'Eighth Boys Hostel (Name TBD)', shortCode: 'BH-08', type: 'boys', messId: 'mess-central-boys', capacity: 300, notes: 'Confirm with MNNIT Hostel Office' },
  
  // 3 Girls Hostels
  { id: 'h-sngh', name: 'Sarojini Naidu Girls Hostel', shortCode: 'SNGH', type: 'girls', messId: 'mess-girls-composite', capacity: 360, notes: 'UG Girls Residents' },
  { id: 'h-kngh', name: 'Kamala Nehru Girls Hostel', shortCode: 'KNGH', type: 'girls', messId: 'mess-girls-composite', capacity: 280, notes: 'UG & PG Girls Residents' },
  { id: 'h-djgh', name: 'Diamond Jubilee Girls Hostel', shortCode: 'DJGH', type: 'girls', messId: 'mess-girls-composite', capacity: 320, notes: 'Senior UG Girls' }
];

export const mnnitAcademicBranches = [
  'Materials Engineering (Dept. of Materials Science)',
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Mechanical Engineering (MED)',
  'Electrical Engineering (EED)',
  'Civil Engineering (CED)',
  'Chemical Engineering (ChED)',
  'Biotechnology (Biotech)'
];