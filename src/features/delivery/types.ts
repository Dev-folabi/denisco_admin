/**
 * A home-delivery area. Fees are integers in kobo, as everywhere else on the
 * wire; the form works in naira and converts.
 */
export interface DeliveryLocation {
  id: string;
  name: string;
  fee: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * The home-delivery offering: the master switch and every area, retired ones
 * included — unlike the public view, which hides itself while the offering is
 * off or no area is active.
 */
export interface DeliveryOffering {
  enabled: boolean;
  locations: DeliveryLocation[];
}

/** The fields the location form writes. Omitted fields are left alone. */
export interface DeliveryLocationWrite {
  name?: string;
  fee?: number;
  active?: boolean;
}
