// Static demo data for Makueni County (fictional water points near Wote and Kilungu).

export const ORG = 'Makueni County Water';

export const REPORT_TYPES = [
	{ id: 'broken', label: 'Broken water point', helper: 'Pump, tap or kiosk not working', icon: 'droplet-off' },
	{ id: 'no-water', label: 'No water', helper: 'Water point dry or not flowing', icon: 'droplet' },
	{ id: 'leak', label: 'Leak or damaged pipe', helper: 'Water escaping from a pipe or tank', icon: 'droplet-half' }
];

export const STATUS = {
	working: { label: 'Working', tone: 'operational' },
	repair: { label: 'Needs repair', tone: 'repair' },
	faulty: { label: 'Not working', tone: 'faulty' },
	unverified: { label: 'Unverified', tone: 'unverified' }
};

export const WATER_POINTS = [
	{ id: 'MKN-BH-004217', name: 'Kwa Mutonga borehole', type: 'Borehole with solar pump and kiosk', ward: 'Kilungu ward', status: 'working', lat: -1.8036, lng: 37.6237, checked: '22 Nov 2026', checkedBy: 'Kilungu Water Association', open: 'Every day, 6:00 to 18:00', note: 'One report is being checked here: leak or damaged pipe, reported today. The status stays Working until the county checks it.' },
	{ id: 'MKN-KS-001108', name: 'Kilungu market kiosk', type: 'Water kiosk on the piped network', ward: 'Kilungu ward', status: 'working', lat: -1.7989, lng: 37.6295, checked: '23 Nov 2026', checkedBy: 'Makueni County Water', open: 'Mon to Sat, 7:00 to 19:00' },
	{ id: 'MKN-HP-000732', name: 'Kwa Kavoo hand pump', type: 'Hand pump', ward: 'Kilungu ward', status: 'working', lat: -1.8121, lng: 37.6312, checked: '19 Nov 2026', checkedBy: 'Kwa Kavoo community', open: 'Always open' },
	{ id: 'MKN-WP-000215', name: 'Kaiti water pan', type: 'Water pan (untreated, for animals and washing)', ward: 'Kaiti sub-county', status: 'working', lat: -1.7902, lng: 37.6102, checked: '17 Nov 2026', checkedBy: 'Makueni County Water', open: 'Always open' },
	{ id: 'MKN-KS-001342', name: 'Wote market kiosk', type: 'Water kiosk on the piped network', ward: 'Wote/Nziu ward', status: 'repair', lat: -1.7804, lng: 37.6303, checked: '13 Nov 2026', checkedBy: 'Makueni County Water', open: 'Mon to Sat, 7:00 to 18:00', note: 'No water for three days. A fault is being checked; a team visits on Thursday 19 Nov.' },
	{ id: 'MKN-BH-004102', name: 'Nziu borehole', type: 'Borehole with motorised pump', ward: 'Wote/Nziu ward', status: 'faulty', lat: -1.7712, lng: 37.6419, checked: '10 Nov 2026', checkedBy: 'Makueni County Water', open: 'Closed for repair' },
	{ id: 'MKN-TP-000391', name: 'Wote health centre tap', type: 'Public tap', ward: 'Wote/Nziu ward', status: 'working', lat: -1.7841, lng: 37.6254, checked: '21 Nov 2026', checkedBy: 'Wote Water Company', open: 'Every day, 6:00 to 20:00' }
];

// Seed reports for the signed-in resident (newest first).
export const SEED_REPORTS = [
	{
		id: 'RPT-MKN-0311', type: 'leak', title: 'Leak or damaged pipe', point: 'MKN-BH-004217', place: 'Kwa Mutonga borehole · Kilungu ward, Kaiti',
		when: 'Today, 9:40', status: 'unverified', note: '“Maji yanavuja kwenye bomba karibu na kioski tangu asubuhi.”', photos: 2,
		steps: [['Sent', 'Today'], ['Being checked', null], ['Fault confirmed', null], ['Fixed', null]]
	},
	{
		id: 'RPT-MKN-0298', type: 'no-water', title: 'No water', point: 'MKN-KS-001342', place: 'Wote market kiosk · Wote/Nziu ward, Makueni',
		when: '12 Nov 2026, 8:15', status: 'review', note: '“Hakuna maji kwenye kioski kwa siku tatu.”', photos: 2,
		steps: [['Sent', '12 Nov'], ['Being checked', '13 Nov'], ['Fault confirmed', null], ['Fixed', null]],
		message: { from: ORG, at: '18 Nov, 9:40', type: 'question', text: 'Is the kiosk tap still dry today? Tell us so the team brings the right parts.', answers: ['Yes, still dry', 'Water is back'] }
	},
	{ id: 'RPT-MKN-0254', type: 'broken', title: 'Broken water point', point: 'MKN-HP-000732', place: 'Kwa Kavoo hand pump · Kilungu ward', when: '2 Nov 2026', status: 'fixed', photos: 1, steps: [['Sent', '2 Nov'], ['Being checked', '3 Nov'], ['Fault confirmed', '4 Nov'], ['Fixed', '9 Nov']] },
	{ id: 'RPT-MKN-0241', type: 'leak', title: 'Leak or damaged pipe', point: 'MKN-TP-000391', place: 'Wote health centre tap · Wote/Nziu ward', when: '28 Oct 2026', status: 'fixed', photos: 1, steps: [['Sent', '28 Oct'], ['Being checked', '29 Oct'], ['Fault confirmed', '30 Oct'], ['Fixed', '2 Nov']] },
	{ id: 'RPT-MKN-0198', type: 'broken', title: 'Broken water point', point: 'MKN-WP-000215', place: 'Kaiti water pan · Kaiti sub-county', when: '30 Sep 2026', status: 'not-fault', photos: 1, steps: [['Sent', '30 Sep'], ['Being checked', '1 Oct'], ['Not a fault', '2 Oct']] }
];

export const REPORT_STATUS = {
	waiting: { label: 'Waiting to send', tone: 'neutral', dot: true },
	unverified: { label: 'Unverified', tone: 'unverified' },
	review: { label: 'Under review', tone: 'info' },
	confirmed: { label: 'Fault confirmed', tone: 'repair' },
	fixed: { label: 'Fixed', tone: 'operational' },
	'not-fault': { label: 'Not a fault', tone: 'neutral', dot: true }
};

// Rough straight-line distance in metres.
export function distanceM(a, b) {
	const R = 6371000, toR = (d) => (d * Math.PI) / 180;
	const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(s));
}
export const fmtDistance = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`);

// Demo location used when the phone does not share its own (Kilungu, near Kwa Mutonga).
export const DEMO_LOCATION = { lat: -1.8024, lng: 37.6248 };
