import { Driver, Truck } from "../types";

export const fetchGPSData = async (): Promise<{ drivers: Driver[], trucks: Truck[] }> => {
  console.debug("[GPS] Establishing secure handshake with ksa.pilot-gps.com...");
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    drivers: [
      { id: 'GPS-D1', name: 'Ahmad Al-Mansour', licenseNumber: 'SA-7721' },
      { id: 'GPS-D2', name: 'Fahad Al-Rashid', licenseNumber: 'SA-1029' },
      { id: 'GPS-D3', name: 'Khalid Abdullah', licenseNumber: 'SA-8844' },
      { id: 'GPS-D4', name: 'Sultan Al-Harbi', licenseNumber: 'SA-3356' },
      { id: 'GPS-D5', name: 'Yousef Al-Otaibi', licenseNumber: 'SA-5511' },
      { id: 'GPS-D6', name: 'Omar Bin-Talal', licenseNumber: 'SA-9012' },
    ],
    trucks: [
      { id: 'GPS-T1', plateNumber: 'LKH 4421', model: 'Mercedes-Benz Actros 2024' },
      { id: 'GPS-T2', plateNumber: 'RRT 9901', model: 'Volvo FH16 Globetrotter' },
      { id: 'GPS-T3', plateNumber: 'BSA 2210', model: 'Scania R500' },
      { id: 'GPS-T4', plateNumber: 'KSA 2030', model: 'MAN TGX Gold Edition' },
      { id: 'GPS-T5', plateNumber: 'DMM 5588', model: 'Renault T-High Evolution' },
      { id: 'GPS-T6', plateNumber: 'JED 1111', model: 'Iveco S-Way' },
    ]
  };
};