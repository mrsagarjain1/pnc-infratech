import type { Sector, StateName } from "./project-types";
import { projects } from "./projects";
import { STATE_PROJECTED_COORDS } from "./india-map-geometry";

export interface HeroChapter {
  id: string;
  code: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  metricValue: string;
  metricLabel: string;
  detail: string;
  /** Progress range [0..1] along the 3D expressway flythrough */
  range: [number, number];
}

export interface StatMetric {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  provenance: string;
}

export interface ShowcaseProject {
  id: string;
  projectId: string;
  code: string;
  title: string;
  corridor: string;
  state: StateName;
  sector: Sector;
  delivery: string;
  status: "Ongoing" | "Operating" | "Completed Record";
  highlightMetric: string;
  highlightLabel: string;
  employer: string;
  summary: string;
  image: string;
  coordinates: string;
}

export interface SectorInfo {
  id: Sector;
  code: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  formats: string[];
  image: string;
}

export interface AchievementRecord {
  id: string;
  year: string;
  category: "World & National Record" | "Early Completion Bonus" | "Industry Award" | "Accreditation";
  title: string;
  authority: string;
  metric: string;
  description: string;
  certificateImage?: string;
}

export interface AnnualReportItem {
  fy: string;
  title: string;
  tag: string;
  pdfPath: string;
  officialUrl: string;
  highlights: string[];
}

export interface CareerOpening {
  sn: string;
  code: string;
  title: string;
  department: "Highways & EPC" | "Water & Irrigation" | "HAM & O&M" | "Finance, Tax & Legal" | "Engineering & Corporate";
  experience: string;
  qualification: string;
  eligibility: string;
}

export interface StatePresenceNode {
  name: StateName;
  code: string;
  region: "North" | "West" | "Central" | "East" | "South" | "North-East";
  /** Normalised SVG coordinates on our 1000x1100 India projection */
  x: number;
  y: number;
  flagship: string;
}

export const COMPANY_INFO = {
  name: "PNC Infratech Limited",
  legalName: "PNC Infratech Limited",
  formerName: "PNC Construction Company Limited",
  incorporatedYear: 1999,
  certification: "An ISO 9001:2015 Certified Company (DNV)",
  accreditation:
    'Military Engineer Services (MES) "SS" (Super Special Class) Accreditation for Unlimited Contract Value',
  tagline: "Engineering India’s High-Velocity Arterial Infrastructure",
  overviewShort:
    "Incorporated in 1999, PNC Infratech Limited is one of India’s front-ending infrastructure investment, development, construction, operation and management companies across expressways, highways, bridges, flyovers, airport runways, water supply, dedicated rail corridors, and industrial area development.",
  overviewLong:
    'We provide end-to-end infrastructure implementation solutions that include design, engineering, procurement, construction, and O&M services on fixed-sum turnkey (EPC), "Design-Build-Finance-Operate-Transfer" (DBFOT) Toll, Annuity, Hybrid Annuity (HAM), Operate-Maintain-Transfer (OMT) and other formats under one roof.',
  vision:
    "To become among the top 3 infrastructure investment, development and construction solution providers in the country.",
  mission:
    "We at PNC Infratech Limited strive to become a spearheading force in delivering infrastructure projects by continually achieving excellence in all spheres of activities while maintaining our leadership in timely completion of projects by adopting state-of-the-art and sustainable technologies.",
  philosophy:
    "In this age of technological revolution and globalization, one must think globally and act locally in the best interest of value creation and nation building.",
  corporateOffice: {
    label: "Corporate Office — Agra",
    companySecretary: "Mr. Kumar Jain (Company Secretary)",
    address: "3/22 D, Civil Lines, PNC Tower, Bypass Road, Agra - 282002, Uttar Pradesh, India",
    phone: "08047636259",
    email: "hr@pncinfratech.com",
  },
  registeredOffice: {
    label: "Registered Office — New Delhi",
    address:
      "NBCC Plaza, Tower II, 4th Floor, Pushp Vihar (Near Saket), New Delhi - 110 017, India",
    website: "https://www.pncinfratech.com",
  },
  documents: {
    corporateBrochurePdf: "https://www.pncinfratech.com/pnc-infratech.pdf",
    fraudWarningPdf: "https://www.pncinfratech.com/frauduent-offers-employment.pdf",
  },
} as const;

export const HERO_CHAPTERS: HeroChapter[] = [
  {
    id: "corridor-origin",
    code: "CH. 00+000 // EXPRESSWAY GENESIS",
    eyebrow: "PNC INFRATECH LIMITED · EST. 1999 · ISO 9001:2015 DNV",
    title: "Architecting India’s National Arteries.",
    subtitle:
      "From eight-lane greenfield expressways and cable-stayed river bridges to defence airfields and rural water grids—engineered end-to-end under one roof.",
    metricValue: "137+",
    metricLabel: "Major Mandates Catalogued Across 16 States",
    detail: "EPC · DBFOT Toll · Hybrid Annuity (HAM) · Annuity · OMT",
    range: [0, 0.24],
  },
  {
    id: "record-velocity",
    code: "CH. 148+N // 100-HOUR PAVING RECORD",
    eyebrow: "ASIA BOOK OF RECORDS & INDIA BOOK OF RECORDS",
    title: "100 Hours of Unbroken Asphalt Velocity.",
    subtitle:
      "On Package 29 of the Delhi–Vadodara Greenfield Expressway (NH-148N) in Panchmahal, Gujarat, PNC laid the highest quantity of bituminous mix continuously for 100 hours.",
    metricValue: "100 hrs",
    metricLabel: "Continuous Flexible Pavement Record (Pkg 29, NH-148N)",
    detail: "Certified by Asia Book of Records & India Book of Records",
    range: [0.24, 0.5],
  },
  {
    id: "bridge-crossing",
    code: "CH. 218+300 // EARLY-COMPLETION DNA",
    eyebrow: "NHAI & UPEIDA EARLY COMPLETION BONUSES",
    title: "Delivered Ahead of Schedule. Every Corridor.",
    subtitle:
      "First company in India to receive an NHAI early-completion bonus (Agra–Gwalior NH-3), followed by 132 days early on Purvanchal Expressway Pkg V and 109 days early on Agra–Lucknow Expressway.",
    metricValue: "132 days",
    metricLabel: "Ahead of Schedule on Purvanchal Expressway Pkg V",
    detail: "6 Major Early-Completion Bonuses & Toll Commencements",
    range: [0.5, 0.76],
  },
  {
    id: "multi-sector-horizon",
    code: "CH. 391+962 // MULTI-SECTOR HORIZON",
    eyebrow: "HIGHWAYS · AIRPORTS · RAIL · WATER · INDUSTRIAL · MINING",
    title: "Integrated From Mining to Commissioning.",
    subtitle:
      "In-house design, owned quarry & crushing ecosystems, a large fleet of automated pavers and batching plants, and long-term O&M stewardship across India.",
    metricValue: "16 States",
    metricLabel: "Pan-India Execution Footprint",
    detail: "MES 'SS' Super Special Class Unlimited Contract Accreditation",
    range: [0.76, 1.0],
  },
];

export const KEY_METRICS: StatMetric[] = [
  {
    id: "projects",
    value: projects.length,
    suffix: "",
    label: "Catalogued Infrastructure Mandates",
    sublabel: "Across EPC, BOT/HAM, Airports, Bridges, Water, Rail & Mining",
    provenance: "Observed across highway, water, power & completed project ledgers",
  },
  {
    id: "continuous-paving",
    value: 100,
    suffix: " hrs",
    label: "Continuous Bituminous Paving Record",
    sublabel: "Delhi–Vadodara Greenfield Expressway (Package 29, Gujarat)",
    provenance: "Asia Book of Records & India Book of Records (profile.html)",
  },
  {
    id: "early-bonus",
    value: 132,
    suffix: " days",
    label: "Peak Early-Completion Bonus",
    sublabel: "Purvanchal Expressway Package V for UPEIDA (plus 109d on Agra–Lucknow)",
    provenance: "Achievements & Accolades ledger (profile.html#achievements)",
  },
  {
    id: "states",
    value: 16,
    suffix: " states",
    label: "Pan-India Execution Footprint",
    sublabel: "From Punjab & Uttarakhand to Karnataka, Tamil Nadu & Assam",
    provenance: "PAN-India Presence registry (activities.html#presence)",
  },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "delhi-vadodara-pkg31",
    projectId: "1-1-01",
    code: "NH-148N // PKG-31 & PKG-29",
    title: "Delhi–Vadodara Eight-Lane Access-Controlled Greenfield Expressway",
    corridor: "Pratap Nagar (SH-63) to Dodka Village (NE-1), Vadodara & Panchmahal",
    state: "Gujarat",
    sector: "highway",
    delivery: "EPC Mode · Bharatmala Pariyojana",
    status: "Ongoing",
    highlightMetric: "8 Lanes",
    highlightLabel: "Greenfield Alignment + 100-Hr Record Corridor",
    employer: "National Highways Authority of India (NHAI)",
    summary:
      "Eight-lane access-controlled expressway segment (Ch. 824+920 to 844+382) in Vadodara District alongside Package 29 in Panchmahal where PNC set the Asia & India Book of Records for 100-hour non-stop bituminous paving.",
    image: "/images/real/cloverleaf-interchange.jpg",
    coordinates: "22.3072° N, 73.1812° E",
  },
  {
    id: "kanpur-lucknow-expressway",
    projectId: "2-2-03",
    code: "BHARATMALA // PKG-1 & PKG-2",
    title: "Kanpur–Lucknow Six-Lane (Upgradable to Eight-Lane) Expressway",
    corridor: "Km 10.980 to Km 73.744 including Spur across Unnao & Lucknow",
    state: "Uttar Pradesh",
    sector: "highway",
    delivery: "Hybrid Annuity Mode (HAM / DBOT Annuity)",
    status: "Operating",
    highlightMetric: "62.7 km",
    highlightLabel: "Combined Package 1 & Package 2 High-Speed Corridor",
    employer: "National Highways Authority of India (NHAI)",
    summary:
      "Flagship six-lane access-controlled expressway upgradable to eight lanes between Kanpur and Lucknow under Bharatmala Pariyojana, executed across both Package 1 and Package 2 on Hybrid Annuity Mode.",
    image: "/images/real/elevated-viaduct.jpg",
    coordinates: "26.6486° N, 80.6625° E",
  },
  {
    id: "samruddhi-mahamarg",
    projectId: "1-1-04",
    code: "MSRDC // SAMRUDDHI & JNE-04",
    title: "Maharashtra Samruddhi Mahamarg & Jalna–Nanded Expressway Connector",
    corridor: "Nagpur–Mumbai Super Communication Expressway & Package JNE-04 (28.895 km)",
    state: "Maharashtra",
    sector: "highway",
    delivery: "EPC Mode",
    status: "Ongoing",
    highlightMetric: "28.9 km",
    highlightLabel: "Access-Controlled Connector (Kumbhari to Katneshwar)",
    employer: "Maharashtra State Road Development Corporation (MSRDC)",
    summary:
      "Execution on the Hindu Hrudaysamrat Balasaheb Thackeray Maharashtra Samruddhi Mahamarg corridor plus the access-controlled Jalna–Nanded Expressway connector (Package JNE-04) and Pune Ring Road Package PRR-E2.",
    image: "/images/real/samruddhi-corridor.jpg",
    coordinates: "19.5761° N, 76.4478° E",
  },
  {
    id: "purvanchal-expressway",
    projectId: "6-1-49",
    code: "UPEIDA // PKG-V & PKG-VI",
    title: "Purvanchal Expressway Packages V & VI (Sultanpur to Azamgarh)",
    corridor: "Sansarpur (Km 164) to Gobindpur to Mojrapur (Dist. Azamgarh)",
    state: "Uttar Pradesh",
    sector: "highway",
    delivery: "EPC Mode · Greenfield Expressway",
    status: "Completed Record",
    highlightMetric: "+132 Days",
    highlightLabel: "Early Completion Bonus on Pkg V (+97 Days on Pkg VI)",
    employer: "Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)",
    summary:
      "Dual greenfield expressway packages delivered 132 days and 97 days ahead of schedule respectively, earning consecutive UPEIDA early-completion performance bonuses.",
    image: "/images/real/purvanchal-twilight.jpg",
    coordinates: "26.0686° N, 83.1836° E",
  },
  {
    id: "ganga-major-bridges",
    projectId: "1-1-08",
    code: "UPSBC & MoRTH // GANGA CROSSINGS",
    title: "4-Lane Major Bridges Across River Ganga at Kanpur & Prayagraj",
    corridor: "Bhairoghat–Trans Ganga City (Kanpur) & Singraur Uphar NH-731A (Prayagraj)",
    state: "Uttar Pradesh",
    sector: "bridge",
    delivery: "EPC & Hybrid Annuity Mode (HAM)",
    status: "Ongoing",
    highlightMetric: "4-Lane",
    highlightLabel: "Major River Ganga Bridges + Protection & Approach Works",
    employer: "UP State Bridge Corporation (UPSBC) & MoRTH",
    summary:
      "High-capacity four-lane river bridge connecting Bhairoghat Dhobighat Jalkal Campus to Trans Ganga City in Kanpur, alongside the NH-731A four-lane highway and Ganga Bridge package at Prayagraj.",
    image: "/images/real/ganga-river-bridge.jpg",
    coordinates: "26.4981° N, 80.3269° E",
  },
  {
    id: "varanasi-pantnagar-airports",
    projectId: "1-3-01",
    code: "AAI & MES // 25 AIRFIELD MANDATES",
    title: "Varanasi International, Pantnagar & Defence Air Force Runways",
    corridor: "Varanasi, Pantnagar, Kolkata, Pune, Yelahanka, Gorakhpur, Jorhat & Chakeri",
    state: "Uttar Pradesh",
    sector: "airport",
    delivery: "EPC Turnkey Aviation Infrastructure",
    status: "Ongoing",
    highlightMetric: "25",
    highlightLabel: "Civil & Military Airfield Runway / Terminal Mandates",
    employer: "Airports Authority of India (AAI) & Military Engineer Services (MES)",
    summary:
      "Runway extension, recarpeting, parallel taxi tracks, CAT-II lighting, and new domestic terminal cityside works across 2 ongoing and 23 completed civil and Indian Air Force bases nationwide.",
    image: "/images/real/airport-runway.jpg",
    coordinates: "25.4524° N, 82.8593° E",
  },
  {
    id: "srisailam-water-grid",
    projectId: "3-1-01",
    code: "WATER & IRRIGATION // KURNOOL & UP",
    title: "Srisailam SRBC/GNSS Canal System & Namami Gange Rural Water Grid",
    corridor: "Pothireddypadu Head Regulator to Gorukallu Reservoir (56.775 km) & 7 UP Divisions",
    state: "Andhra Pradesh",
    sector: "water",
    delivery: "LS Turnkey & 10-Year Commissioning + O&M",
    status: "Ongoing",
    highlightMetric: "56.8 km",
    highlightLabel: "Canal Upgradation + 7 Divisional Rural Water Grids",
    employer: "Water Resources Dept. Andhra Pradesh & SWSM Namami Gange",
    summary:
      "Upgradation of the canal system from foreshore of Srisailam Reservoir up to Gorukallu Balancing Reservoir in Kurnool, plus DPR, construction, commissioning and 10-year O&M of rural drinking water supply across 7 divisions in Uttar Pradesh.",
    image: "/images/real/water-canal-reservoir.jpg",
    coordinates: "15.8281° N, 78.0373° E",
  },
  {
    id: "haryana-orbital-rail-gevra",
    projectId: "1-2-01",
    code: "DFCCIL / HORCL / SECL // RAIL & MINING",
    title: "Haryana Orbital Rail Corridor (Pkg C-23) & Gevra OCP Coal Expansion",
    corridor: "New Patli to Sultanpur IR Connectivity & Gevra Megamine (Chhattisgarh)",
    state: "Haryana",
    sector: "rail",
    delivery: "EPC Civil Works & 1,825-Day HEMM Surface Miner Operations",
    status: "Ongoing",
    highlightMetric: "25.9 km",
    highlightLabel: "Orbital Rail Section + 5-Year Gevra Surface Mining",
    employer: "Haryana Rail Infrastructure Dev. Corp. (HRIDC) & SECL",
    summary:
      "Earthwork, bridges, station buildings and Indian Railways connectivity on Package C-23 in Haryana, alongside heavy earth-moving and surface-miner coal extraction at South Eastern Coalfields Limited’s Gevra OCP Expansion.",
    image: "/images/real/dedicated-rail-viaduct.jpg",
    coordinates: "28.3875° N, 76.9060° E",
  },
];

export const SECTORS: SectorInfo[] = [
  {
    id: "highway",
    code: "01 // HIGHWAYS & EXPRESSWAYS",
    title: "Access-Controlled Expressways & National Highways",
    shortTitle: "Highways & Expressways",
    tagline: "6-lane & 8-lane greenfield corridors across Bharatmala and state expressway grids",
    description:
      "End-to-end execution of national highways, ring roads, elevated corridors and greenfield expressways with in-house quarry-to-pavement integration and electronic toll management.",
    formats: ["EPC Turnkey", "Hybrid Annuity (HAM)", "DBFOT (Toll)", "BOT (Annuity)", "OMT"],
    image: "/images/real/cloverleaf-interchange.jpg",
  },
  {
    id: "airport",
    code: "02 // AVIATION & DEFENCE RUNWAYS",
    title: "Airport Runways, Aprons, Taxiways & Terminals",
    shortTitle: "Airports & Runways",
    tagline: "25 civil and Indian Air Force airfield mandates from Kolkata and Pune to Varanasi",
    description:
      "Rigid and flexible airfield pavements, rapid-exit taxi tracks, CAT-II approach lighting, blast pads, and cityside terminal buildings for AAI, RITES, and Military Engineer Services.",
    formats: ["Runway Strengthening", "CAT-II Lighting", "Parallel Taxiways", "Terminal MEP"],
    image: "/images/real/airport-runway.jpg",
  },
  {
    id: "bridge",
    code: "03 // BRIDGES & ELEVATED FLYOVERS",
    title: "Major River Bridges, ROBs & Multi-Loop Flyovers",
    shortTitle: "Bridges & Flyovers",
    tagline: "Major crossings over the Ganga, Yamuna, Chambal and Gomti rivers",
    description:
      "High-level river bridges, railway over-bridges, cloverleaf interchanges, and multi-loop urban flyovers engineered for heavy axle loads and seismic resilience.",
    formats: ["Major River Bridges", "Urban Flyovers", "Rail Over-Bridges", "Approach Protection"],
    image: "/images/real/ganga-river-bridge.jpg",
  },
  {
    id: "water",
    code: "04 // WATER SUPPLY & IRRIGATION",
    title: "Rural Drinking Water Grids & Reservoir Canal Systems",
    shortTitle: "Water & Irrigation",
    tagline: "Srisailam foreshore canal system & Namami Gange divisional water supply schemes",
    description:
      "Survey, DPR preparation, intake works, water treatment, distribution networks, reservoir canal lining, and 10-year post-commissioning O&M stewardship.",
    formats: ["LS Turnkey Canals", "Rural Water DPR + 10-Yr O&M", "Balancing Reservoirs"],
    image: "/images/real/water-canal-reservoir.jpg",
  },
  {
    id: "rail",
    code: "05 // DEDICATED RAIL CORRIDORS",
    title: "Dedicated Freight & Orbital Rail Corridors",
    shortTitle: "Rail Corridors",
    tagline: "Civil works, bridges, stations and Indian Railways network connectivity",
    description:
      "Formation earthwork, major and minor rail bridges, retaining walls, station buildings, and track connectivity for DFCCIL and Haryana Orbital Rail corridors.",
    formats: ["DFCCIL Track Civil", "Orbital Rail Packages", "Station & Yard Works"],
    image: "/images/real/dedicated-rail-viaduct.jpg",
  },
  {
    id: "industrial",
    code: "06 // INDUSTRIAL, POWER & MINING",
    title: "Industrial Estates, Power Transmission & Coal Mining",
    shortTitle: "Industrial, Power & Coal",
    tagline: "Narela Industrial Estate O&M, 132/220kV transmission & Gevra OCP coal mining",
    description:
      "Annuity-based industrial estate redevelopment and management (DSIIDC Narela), UPPCL transmission lines and substations, and surface-miner coal extraction for SECL.",
    formats: ["Industrial Annuity O&M", "132kV/220kV Transmission", "HEMM Surface Mining"],
    image: "/images/real/smart-toll-industrial.jpg",
  },
];

export const CORE_STRENGTHS: { title: string; detail: string; code: string }[] = [
  {
    code: "STR-01",
    title: "Integrated Capabilities from Mining to Commissioning",
    detail:
      "Backward-integrated aggregate mining, crushing, hot-mix and concrete batching ecosystems paired with full-lifecycle O&M execution.",
  },
  {
    code: "STR-02",
    title: "End-to-End Project Management Mastery",
    detail:
      "Disciplined critical-path scheduling and corridor logistics that consistently deliver national expressway packages months ahead of contractual COD.",
  },
  {
    code: "STR-03",
    title: "Strong Financial Performance & Credit Profile",
    detail:
      "Prudent capital allocation and best-in-industry credit profile supporting concurrent large-ticket HAM and EPC mandates.",
  },
  {
    code: "STR-04",
    title: "Solid Techno-Experiential-Financial Credentials",
    detail:
      "Pre-qualified for complex multi-hundred-crore tenders across NHAI, MoRTH, AAI, DFCCIL, MES, and state authorities.",
  },
  {
    code: "STR-05",
    title: "Optimal Mix of Fund & Non-Fund Based Order Book",
    detail:
      "Balanced portfolio across cash-contract EPC mandates and long-term annuity/toll concessions (DBFOT, HAM, OMT).",
  },
  {
    code: "STR-06",
    title: "In-House Planning, Design & Engineering",
    detail:
      "Dedicated structural, geotechnical, pavement, and quantity-surveying specialists optimizing value engineering from bid to commissioning.",
  },
  {
    code: "STR-07",
    title: "Large Fleet of Sophisticated Machinery & Plants",
    detail:
      "Company-owned automated sensor pavers, high-capacity batching plants, slip-form pavers, crushers, and heavy earth-moving machinery.",
  },
  {
    code: "STR-08",
    title: "Experienced Employee Base & Leadership",
    detail:
      "Seasoned project directors, civil engineers, finance controllers, and toll-management specialists operating across 16 states.",
  },
  {
    code: "STR-09",
    title: "Unflinching Trust of Public Stakeholders",
    detail:
      "Repeat mandates from 18+ central and state government infrastructure authorities built on quality assurance and early delivery.",
  },
];

export const GROWTH_OBJECTIVES: string[] = [
  "To expand into new functional areas with continued preference for the roads & highways space",
  "To continue focus on EPC contracts while carefully increasing penetration in DBFOT / HAM projects",
  "To maintain performance efficiency and competitiveness across all business activities",
  "To develop & maintain strong relationships with our clients and strategic partners",
  "To strengthen systems and internal processes across project sites and corporate functions",
  "To adopt sustainable practices in all spheres of operations",
];

export const ACHIEVEMENTS: AchievementRecord[] = [
  {
    id: "record-100hr",
    year: "Record Milestone",
    category: "World & National Record",
    title: "100-Hour Non-Stop Bituminous Mix Paving Record on Delhi–Vadodara Expressway",
    authority: "Asia Book of Records & India Book of Records",
    metric: "100 Hours Continuous",
    description:
      "Set national and continental records for the highest quantity of bituminous mix laid for the longest length of flexible pavement continuously for 100 hours at Package 29 of Delhi–Vadodara Greenfield Expressway in Panchmahal, Gujarat.",
    certificateImage: "/images/projects/asia-book-of-records.jpg",
  },
  {
    id: "purvanchal-pkg5",
    year: "Early Completion",
    category: "Early Completion Bonus",
    title: "132 Days Early Completion Bonus — Purvanchal Expressway (Package V)",
    authority: "UPEIDA (Uttar Pradesh Expressways Industrial Development Authority)",
    metric: "132 Days Early",
    description:
      "Received performance bonus from UPEIDA for completing Package V (Sansarpur to Gobindpur, Sultanpur–Azamgarh) of Purvanchal Expressway 132 days ahead of schedule.",
  },
  {
    id: "agra-lucknow-pkg1",
    year: "Early Completion",
    category: "Early Completion Bonus",
    title: "109 Days Early Completion Bonus — Agra–Lucknow Expressway (Package I)",
    authority: "UPEIDA (Uttar Pradesh Expressways Industrial Development Authority)",
    metric: "109 Days Early",
    description:
      "Received bonus from UPEIDA for completing the Agra to Firozabad greenfield section (Package I) of the Agra–Lucknow Expressway 109 days ahead of the scheduled completion date.",
  },
  {
    id: "purvanchal-pkg6",
    year: "Early Completion",
    category: "Early Completion Bonus",
    title: "97 Days Early Completion Bonus — Purvanchal Expressway (Package VI)",
    authority: "UPEIDA (Uttar Pradesh Expressways Industrial Development Authority)",
    metric: "97 Days Early",
    description:
      "Received bonus from UPEIDA for 97 days early completion of Purvanchal Expressway Package VI (Gobindpur to Mojrapur, District Azamgarh) in Uttar Pradesh.",
  },
  {
    id: "raebareli-jaunpur",
    year: "Early Completion",
    category: "Early Completion Bonus",
    title: "96 Days Early Completion Bonus — Raebareli–Jaunpur Section of NH-231",
    authority: "NHAI (National Highways Authority of India)",
    metric: "96 Days Early",
    description:
      "Received bonus from NHAI for 96 days early completion of 2-laning with paved shoulders of the 166.4 km Raebareli–Jaunpur section of NH-231 in Uttar Pradesh.",
  },
  {
    id: "gwalior-bhind-bot",
    year: "Early COD",
    category: "Early Completion Bonus",
    title: "Over 4 Months Early Toll Commencement — Gwalior–Bhind BOT Road Project",
    authority: "MPRDC (Madhya Pradesh Road Development Corporation)",
    metric: "4+ Months Early",
    description:
      "Completed construction and commenced toll collection over 4 months earlier than the Scheduled Commercial Operation Date (COD) on NH-92.",
  },
  {
    id: "first-nhai-bonus",
    year: "Pioneer Milestone",
    category: "Early Completion Bonus",
    title: "First Company in India to Receive NHAI Early-Completion Bonus (Agra–Gwalior NH-3)",
    authority: "NHAI (National Highways Authority of India)",
    metric: "1st in India",
    description:
      "PNC was the first company to receive a bonus from NHAI for early completion of four-laning of the Agra–Gwalior section of NH-3 in Uttar Pradesh.",
  },
  {
    id: "cw-top-challengers",
    year: "2018-19 & 2019-20",
    category: "Industry Award",
    title: "India’s Top Challengers Award & Fastest Growing Construction Company",
    authority: "Construction World (17th & 18th Global Annual Awards)",
    metric: "2× Consecutive",
    description:
      "Honoured with India’s Top Challengers Award (2018-19 and 2019-20) and Fastest Growing Construction Company in Medium Category (2019-20) by Construction World.",
    certificateImage: "/images/projects/india-book-of-records.jpg",
  },
  {
    id: "mes-ss-class",
    year: "Unlimited Value",
    category: "Accreditation",
    title: 'Military Engineer Services "SS" (Super Special Class) Accreditation',
    authority: "Military Engineer Services (MES), Government of India",
    metric: "Class 'SS' Unlimited",
    description:
      'Accredited in the highest "SS" (Super Special Class) category by Military Engineer Services for undertaking civil engineering works of unlimited contract value, alongside ISO 9001:2015 certification from DNV.',
  },
];

export const CLIENTELE_AUTHORITIES: {
  short: string;
  name: string;
  category: "Central Authority" | "State Expressway & Road" | "Aviation, Defence & Rail" | "Water, Power & Industrial";
}[] = [
  {
    short: "NHAI",
    name: "National Highways Authority of India",
    category: "Central Authority",
  },
  {
    short: "MoRTH",
    name: "Ministry of Road Transport and Highways",
    category: "Central Authority",
  },
  {
    short: "UPEIDA",
    name: "Uttar Pradesh Expressways Industrial Development Authority",
    category: "State Expressway & Road",
  },
  {
    short: "MSRDC",
    name: "Maharashtra State Road Development Corporation Limited",
    category: "State Expressway & Road",
  },
  {
    short: "MPRDC",
    name: "Madhya Pradesh Road Development Corporation Limited",
    category: "State Expressway & Road",
  },
  {
    short: "HSRDC",
    name: "Haryana State Roads and Bridges Development Corporation Limited",
    category: "State Expressway & Road",
  },
  {
    short: "UPSHA",
    name: "Uttar Pradesh State Highways Authority",
    category: "State Expressway & Road",
  },
  {
    short: "AAI",
    name: "Airports Authority of India",
    category: "Aviation, Defence & Rail",
  },
  {
    short: "MES",
    name: "Military Engineer Services (Government of India)",
    category: "Aviation, Defence & Rail",
  },
  {
    short: "DFCCIL",
    name: "Dedicated Freight Corridor Corporation of India Limited",
    category: "Aviation, Defence & Rail",
  },
  {
    short: "HORCL",
    name: "Haryana Orbital Rail Corporation Limited",
    category: "Aviation, Defence & Rail",
  },
  {
    short: "RITES",
    name: "RITES Limited",
    category: "Aviation, Defence & Rail",
  },
  {
    short: "DSIIDC",
    name: "Delhi State Industrial and Infrastructure Development Corporation",
    category: "Water, Power & Industrial",
  },
  {
    short: "UPPCL",
    name: "Uttar Pradesh Power Corporation Limited",
    category: "Water, Power & Industrial",
  },
  {
    short: "SWSM",
    name: "State Water & Sanitation Mission (Namami Gange & Rural Water Supply Dept.)",
    category: "Water, Power & Industrial",
  },
  {
    short: "Govt. of UP",
    name: "Government of Uttar Pradesh (PWD & UPSBC)",
    category: "State Expressway & Road",
  },
  {
    short: "Govt. of MP",
    name: "Government of Madhya Pradesh (MP-PWD)",
    category: "State Expressway & Road",
  },
  {
    short: "Govt. of AP",
    name: "Government of Andhra Pradesh (Water Resources Dept.)",
    category: "Water, Power & Industrial",
  },
];

export const STATE_PRESENCE: StatePresenceNode[] = [
  {
    name: "Uttar Pradesh",
    code: "UP",
    region: "North",
    x: STATE_PROJECTED_COORDS["Uttar Pradesh"][0],
    y: STATE_PROJECTED_COORDS["Uttar Pradesh"][1],
    flagship: "Kanpur–Lucknow Expressway, Purvanchal Expressway, Agra–Lucknow Expressway, Ganga Bridges & Namami Gange Water Grids",
  },
  {
    name: "Madhya Pradesh",
    code: "MP",
    region: "Central",
    x: STATE_PROJECTED_COORDS["Madhya Pradesh"][0],
    y: STATE_PROJECTED_COORDS["Madhya Pradesh"][1],
    flagship: "Western Bhopal Bypass (HAM), Gwalior Elevated Corridor (Swarn Rekha River) & Jaora–Nayagaon 4-Lane SH-31",
  },
  {
    name: "Maharashtra",
    code: "MH",
    region: "West",
    x: STATE_PROJECTED_COORDS["Maharashtra"][0],
    y: STATE_PROJECTED_COORDS["Maharashtra"][1],
    flagship: "Samruddhi Mahamarg, Jalna–Nanded Expressway Connector (JNE-04), Pune Ring Road (PRR-E2) & AFS Pune Runway",
  },
  {
    name: "Bihar",
    code: "BR",
    region: "East",
    x: STATE_PROJECTED_COORDS["Bihar"][0],
    y: STATE_PROJECTED_COORDS["Bihar"][1],
    flagship: "6-Lane Greenfield Varanasi–Ranchi–Kolkata Highway (Packages 2, 3 & 6) & BSHP-IV High-Level Bridge",
  },
  {
    name: "Karnataka",
    code: "KA",
    region: "South",
    x: STATE_PROJECTED_COORDS["Karnataka"][0],
    y: STATE_PROJECTED_COORDS["Karnataka"][1],
    flagship: "6-Lane Greenfield Highway NH-150C (Akkalkot to KN/TS Border Pkg-II) & Air Force Station Yelahanka Runway",
  },
  {
    name: "Rajasthan",
    code: "RJ",
    region: "West",
    x: STATE_PROJECTED_COORDS["Rajasthan"][0],
    y: STATE_PROJECTED_COORDS["Rajasthan"][1],
    flagship: "Bharatpur Flyover, Jaipur Mahal Road High-Level Bridge & Dholpur–Morena Chambal Bridge Corridor",
  },
  {
    name: "Gujarat",
    code: "GJ",
    region: "West",
    x: STATE_PROJECTED_COORDS["Gujarat"][0],
    y: STATE_PROJECTED_COORDS["Gujarat"][1],
    flagship: "Delhi–Vadodara 8-Lane Greenfield Expressway (Pkg 29 Record Corridor & Pkg 31, NH-148N)",
  },
  {
    name: "Haryana",
    code: "HR",
    region: "North",
    x: STATE_PROJECTED_COORDS["Haryana"][0],
    y: STATE_PROJECTED_COORDS["Haryana"][1],
    flagship: "Haryana Orbital Rail Corridor (Package C-23) & Gurgaon–Nuh–Rajasthan Border 4-Lane SH-13",
  },
  {
    name: "Uttarakhand",
    code: "UK",
    region: "North",
    x: STATE_PROJECTED_COORDS["Uttarakhand"][0],
    y: STATE_PROJECTED_COORDS["Uttarakhand"][1],
    flagship: "Pantnagar Airport New Domestic Terminal & Dehradun Airport Runway Extension for A320/B737",
  },
  {
    name: "Chhattisgarh",
    code: "CG",
    region: "Central",
    x: STATE_PROJECTED_COORDS["Chhattisgarh"][0],
    y: STATE_PROJECTED_COORDS["Chhattisgarh"][1],
    flagship: "SECL Gevra OCP Expansion Coal Mining (1,825 Days) & Raipur Civil Airdrome Runway",
  },
  {
    name: "West Bengal",
    code: "WB",
    region: "East",
    x: STATE_PROJECTED_COORDS["West Bengal"][0],
    y: STATE_PROJECTED_COORDS["West Bengal"][1],
    flagship: "NSCBI International Airport Kolkata Main Runway 19L/01R CAT-II Lighting & AFS Panagarh Runway",
  },
  {
    name: "Assam",
    code: "AS",
    region: "North-East",
    x: STATE_PROJECTED_COORDS["Assam"][0],
    y: STATE_PROJECTED_COORDS["Assam"][1],
    flagship: "Jorhat Civil Enclave Apron Expansion & Air Force Station Jorhat Runway Extension",
  },
  {
    name: "Delhi",
    code: "DL",
    region: "North",
    x: STATE_PROJECTED_COORDS["Delhi"][0],
    y: STATE_PROJECTED_COORDS["Delhi"][1],
    flagship: "Narela Industrial Estate Renovation, Management & Annuity O&M (DSIIDC) + Registered Office",
  },
  {
    name: "Punjab",
    code: "PB",
    region: "North",
    x: STATE_PROJECTED_COORDS["Punjab"][0],
    y: STATE_PROJECTED_COORDS["Punjab"][1],
    flagship: "National & State Highway Upgradation Mandates",
  },
  {
    name: "Andhra Pradesh",
    code: "AP",
    region: "South",
    x: STATE_PROJECTED_COORDS["Andhra Pradesh"][0],
    y: STATE_PROJECTED_COORDS["Andhra Pradesh"][1],
    flagship: "Srisailam Reservoir Foreshore to Gorukallu Balancing Reservoir Canal System (56.775 km, Kurnool)",
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    region: "South",
    x: STATE_PROJECTED_COORDS["Tamil Nadu"][0],
    y: STATE_PROJECTED_COORDS["Tamil Nadu"][1],
    flagship: "Madurai Airport New Runway Construction & Allied Airside Works (AAI)",
  },
];

export const ANNUAL_REPORTS: AnnualReportItem[] = [
  {
    fy: "FY 2025–26",
    title: "Annual Report FY 2026",
    tag: "Latest Filing",
    pdfPath: "pdfs/annual-report-fy-2026.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-2026.pdf",
    highlights: ["Integrated EPC & HAM Portfolio Review", "Consolidated & Standalone Audited Statements", "Business Responsibility & Sustainability Disclosures"],
  },
  {
    fy: "FY 2024–25",
    title: "Annual Report FY 2025",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy-2025.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-2025.pdf",
    highlights: ["Bharatmala & Greenfield Expressway Progress", "Water & Irrigation Order Book Execution", "SEBI (LODR) Corporate Governance Report"],
  },
  {
    fy: "FY 2023–24",
    title: "Annual Report FY 2024",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy-2024.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-2024.pdf",
    highlights: ["HAM Concession Operational Milestones", "Capital Allocation & Credit Profile Overview"],
  },
  {
    fy: "FY 2022–23",
    title: "Annual Report FY 2023",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy-2023.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-2023.pdf",
    highlights: ["Purvanchal & Delhi–Vadodara Execution", "Rural Water Supply Expansion"],
  },
  {
    fy: "FY 2021–22 (Rev.)",
    title: "Revised Annual Report FY 2021-22",
    tag: "Revised Filing",
    pdfPath: "pdfs/revised-annual-report-fy-2021-22.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/revised-annual-report-fy-2021-22.pdf",
    highlights: ["Revised Statutory & Board Disclosures", "SPV & Subsidiary Financial Statements"],
  },
  {
    fy: "FY 2021–22",
    title: "Annual Report FY 2022",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy-2022.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-2022.pdf",
    highlights: ["100-Hour Paving Record Recognition", "Multi-Sector Order Book Growth"],
  },
  {
    fy: "FY 2020–21",
    title: "Annual Report FY 2021",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy2021.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy2021.pdf",
    highlights: ["Resilient Corridor Execution", "HAM Financial Closures"],
  },
  {
    fy: "FY 2019–20",
    title: "Annual Report FY 2020",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy2020.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy2020.pdf",
    highlights: ["Construction World Fastest Growing Award", "Expressway Package Completions"],
  },
  {
    fy: "FY 2018–19",
    title: "Annual Report FY 2019",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy2019.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy2019.pdf",
    highlights: ["India’s Top Challengers Award Year", "Agra–Lucknow & NHAI Bonus Milestones"],
  },
  {
    fy: "FY 2017–18",
    title: "Annual Report FY 2018",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy2018.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy2018.pdf",
    highlights: ["Hybrid Annuity Model Portfolio Rollout"],
  },
  {
    fy: "FY 2016–17",
    title: "Annual Report FY 2017",
    tag: "Audited Report",
    pdfPath: "pdfs/annual-report-fy-17.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-17.pdf",
    highlights: ["Raebareli–Jaunpur Early Completion"],
  },
  {
    fy: "FY 2015–16",
    title: "Annual Report - FY 16",
    tag: "Archive",
    pdfPath: "pdfs/annual-report-fy-16.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy-16.pdf",
    highlights: ["Post-Listing Infrastructure Expansion"],
  },
  {
    fy: "FY 2014–15",
    title: "Annual Report - FY 15",
    tag: "Archive",
    pdfPath: "pdfs/annual-report-15.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-15.pdf",
    highlights: ["BOT & OMT Highway Operations"],
  },
  {
    fy: "FY 2013–14",
    title: "Annual Report - FY 14",
    tag: "Archive",
    pdfPath: "pdfs/annual-report-fy14.pdf",
    officialUrl: "https://www.pncinfratech.com/pdfs/annual-report-fy14.pdf",
    highlights: ["Foundational EPC & BOT Track Record"],
  },
];

export const SEBI_LODR_DISCLOSURE_CATEGORIES: {
  code: string;
  title: string;
  description: string;
  status: string;
}[] = [
  {
    code: "REG 46 · 01",
    title: "Annual Report of the Company",
    description:
      "Complete archive of audited Annual Reports from FY 2013–14 through FY 2025–26 including revised statutory filings.",
    status: "14 Direct PDF Filings Available",
  },
  {
    code: "REG 46 · 02",
    title: "Financial Results",
    description:
      "Quarterly and annual standalone & consolidated financial results submitted to NSE and BSE pursuant to Regulation 33 & 46.",
    status: "SEBI (LODR) Disclosure Section",
  },
  {
    code: "REG 46 · 03",
    title: "Corporate Presentations & Transcripts",
    description:
      "Investor presentations, quarterly earnings call transcripts, and order-book updates shared with institutional and retail shareholders.",
    status: "SEBI (LODR) Disclosure Section",
  },
  {
    code: "REG 46 · 04",
    title: "Audio / Video Recordings",
    description:
      "Post-earnings conference call audio and video recordings maintained under SEBI Listing Obligations and Disclosure Requirements.",
    status: "SEBI (LODR) Disclosure Section",
  },
  {
    code: "REG 46 · 05",
    title: "Annual Accounts of Subsidiary Companies",
    description:
      "Audited financial statements of BOT, Annuity, and Hybrid Annuity (HAM) Special Purpose Vehicles (SPVs) and subsidiaries.",
    status: "SEBI (LODR) Disclosure Section",
  },
  {
    code: "REG 46 · 06",
    title: "Unpaid & Unclaimed Dividend & TDS Documents",
    description:
      "Shareholder dividend ledgers, IEPF disclosures, and Tax Deducted at Source (TDS) communications on dividend distributions.",
    status: "SEBI (LODR) Disclosure Section",
  },
  {
    code: "REG 46 · 07",
    title: "Impact Assessment Report",
    description:
      "CSR and community infrastructure impact assessment disclosures in accordance with Companies Act & SEBI norms.",
    status: "SEBI (LODR) Disclosure Section",
  },
];

export const CAREER_OPENINGS: CareerOpening[] = [
  {
    sn: "01",
    code: "PC-01",
    title: "VP / AVP / GM / Project-Coordinator",
    department: "Highways & EPC",
    experience: "15+ Years",
    qualification: "BE (Civil) / DCE",
    eligibility:
      "BE (Civil)/DCE with experience 15 years & above in planning & execution of highway projects with expertise in contract administration, project monitoring, leading execution teams, co-ordination with clients/independent engineer/consultants/authorities.",
  },
  {
    sn: "02",
    code: "CON02",
    title: "VP / AVP / GM / DGM / AGM (Contracts)",
    department: "Highways & EPC",
    experience: "10+ Years",
    qualification: "BE (Civil) / DCE (Civil)",
    eligibility:
      "BE (Civil)/DCE (Civil) with experience 10 years & above in comprehensive handling of all techno-contractual matters of infrastructure projects, particularly highway projects, fully conversant with NHAI, MoRTH, FIDIC and other contracts (EPC & PPP) with excellent drafting skills.",
  },
  {
    sn: "03",
    code: "AAF03",
    title: "VP / AVP / GM / DGM / AGM / Manager (Accounts / Audit / Finance)",
    department: "Finance, Tax & Legal",
    experience: "7–20 Years",
    qualification: "CA (Final) / CA (Inter)",
    eligibility:
      "CA (Inter) with 10 to 20 years or CA (Final) with 7 to 20 years experience in Infrastructure/construction sector, well versed with project accounting, preparation & finalization of balance sheets, MIS reports etc. Preference given to candidates with SAP experience.",
  },
  {
    sn: "04",
    code: "DESIGN04",
    title: "AVP / GM / DGM / AGM / Senior Manager (Designs)",
    department: "Engineering & Corporate",
    experience: "10+ Years",
    qualification: "BE (Civil) + PG in Structures / GT / Transportation",
    eligibility:
      "BE (Civil) with post-graduation in Structures/GT/Transportation Engineering and minimum 10 years & above in design & detailed engineering of highways, pavements, bridges & other structures including coordination with clients, authority/independent engineers/consultants.",
  },
  {
    sn: "05",
    code: "PUR05",
    title: "AVP / GM / DGM / AGM (Purchase)",
    department: "Engineering & Corporate",
    experience: "10–25 Years",
    qualification: "BE (Mechanical) / MBA",
    eligibility:
      "BE (Mechanical) / MBA with 10 to 25 years in procurement including market study & analysis, techno-commercial evaluation of machinery, construction materials/items, life-cycle cost analysis & financial negotiations, vendor development with sound knowledge in SAP.",
  },
  {
    sn: "06",
    code: "HR06",
    title: "VP / AVP / GM (HR)",
    department: "Engineering & Corporate",
    experience: "10–25 Years",
    qualification: "MBA / MSW",
    eligibility:
      "MBA/MSW from a reputed institute with minimum 10 to 25 years corporate experience in the construction industry managing HR & ER functions including HR policies, KRA, KPI, PMS, TA, salary negotiations, statutory compliances, legal/court matters, OD, succession planning, and L&D.",
  },
  {
    sn: "07",
    code: "GST07",
    title: "GM (GST)",
    department: "Finance, Tax & Legal",
    experience: "15+ Years",
    qualification: "CA / LLB (Taxation)",
    eligibility:
      "CA/LLB-Taxation with minimum 15 years & above experience in Infrastructure/construction sector with hands-on expertise in both indirect and direct taxation including GST, IT, Custom & Excise Duties at corporate and project site levels with sound knowledge in SAP.",
  },
  {
    sn: "08",
    code: "INS08",
    title: "GM / DGM / AGM (Insurance)",
    department: "Finance, Tax & Legal",
    experience: "15+ Years",
    qualification: "Postgraduate",
    eligibility:
      "Postgraduate with 15 years & above in the insurance department of an EPC sector company with hands-on experience in procuring comprehensive policies at optimal cost, negotiation with insurers, submission of claims and follow-up till realization with SAP proficiency.",
  },
  {
    sn: "09",
    code: "JJM09",
    title: "VP / AVP / GM / DGM / AGM (Water Supply Sector)",
    department: "Water & Irrigation",
    experience: "10–30 Years",
    qualification: "B.E (Civil) / DCE",
    eligibility:
      "B.E (Civil)/DCE with 10 to 30 years in reputed water infrastructure companies handling large-scale surface and underground water supply projects including formulation, budgeting, planning, execution, testing, commissioning and O&M.",
  },
  {
    sn: "10",
    code: "JJM10",
    title: "Sr. Project Manager / Project Manager (Water Supply)",
    department: "Water & Irrigation",
    experience: "10–20 Years",
    qualification: "B.E (Civil) / DCE",
    eligibility:
      "B.E (Civil)/DCE with 10 to 20 years to plan, execute, monitor, test and commission water supply projects under strict deadlines and budgeted costs including quality control, materials reconciliation and billing.",
  },
  {
    sn: "11",
    code: "JJM11",
    title: "GM / AGM / Sr. Manager / Manager (Billing & Planning — Water)",
    department: "Water & Irrigation",
    experience: "10–20 Years",
    qualification: "B.E (Civil) / DCE",
    eligibility:
      "B.E (Civil)/DCE with 10 to 20 years in planning, client and sub-contractor/vendor billing (quantity surveying) of water supply projects, material and sub-contractor reconciliation, and project scheduling.",
  },
  {
    sn: "12",
    code: "PM12",
    title: "Chief Project Manager / Sr. Project Manager / Project Manager",
    department: "Highways & EPC",
    experience: "15–25 Years",
    qualification: "BE (Civil) / DCE",
    eligibility:
      "BE (Civil)/DCE with 15 to 25 years in end-to-end project management including planning/execution, quality control, and contract administration of highway projects comprising flexible & rigid pavements and structures on NHAI projects.",
  },
  {
    sn: "13",
    code: "A&F13",
    title: "VP / AVP / GM (Accounts / Finance — SPV & Highway)",
    department: "Finance, Tax & Legal",
    experience: "15+ Years",
    qualification: "Chartered Accountant (CA)",
    eligibility:
      "CA with minimum 15 years & above in construction/highway sector, well versed with SPV accounting, taxation, preparation & finalization of balance sheets & MIS reports with hands-on experience in SAP.",
  },
  {
    sn: "14",
    code: "HAM01",
    title: "Project Manager (HAM / BOT / Annuity O&M)",
    department: "HAM & O&M",
    experience: "15+ Years",
    qualification: "Graduate in Civil Engineering",
    eligibility:
      "Graduate in Civil Engineering with minimum 15 years post-qualification experience in Operations & Maintenance of HAM/BOT/Annuity road projects. Experience in handling Concession Agreements for road projects is mandatory.",
  },
  {
    sn: "15",
    code: "HAM02",
    title: "Maintenance Manager (National Highways HAM)",
    department: "HAM & O&M",
    experience: "12+ Years",
    qualification: "Graduate in Civil Engineering",
    eligibility:
      "Graduate in Civil Engineering with minimum 12 years post-qualification experience in Construction / Operation & Maintenance of roads (preferably National Highways HAM projects).",
  },
  {
    sn: "16",
    code: "HAM03",
    title: "Maintenance Engineer (National Highways HAM)",
    department: "HAM & O&M",
    experience: "8+ Years",
    qualification: "Diploma / Graduate in Civil Engineering",
    eligibility:
      "Diploma/Graduate in Civil Engineering with minimum 8 years post-qualification experience in Construction / Operation & Maintenance of roads (preferably National Highways HAM projects).",
  },
  {
    sn: "17",
    code: "HAM04",
    title: "IT Engineer / Toll Management System (TMS)",
    department: "HAM & O&M",
    experience: "4+ Years",
    qualification: "Diploma / B.Tech (CS) / BCA / MCA",
    eligibility:
      "Diploma/B.Tech in Computer Science/BCA/MCA with minimum 4 years post-qualification experience in Toll Management System (TMS). Experience in TMS is mandatory.",
  },
];

export function getProjectCountsByState(): Record<StateName, number> {
  const counts = {
    Gujarat: 0,
    "Madhya Pradesh": 0,
    Maharashtra: 0,
    Rajasthan: 0,
    Bihar: 0,
    "Uttar Pradesh": 0,
    Haryana: 0,
    Uttarakhand: 0,
    Karnataka: 0,
    "Andhra Pradesh": 0,
    Delhi: 0,
    Chhattisgarh: 0,
    Punjab: 0,
    "West Bengal": 0,
    "Tamil Nadu": 0,
    Assam: 0,
  } satisfies Record<StateName, number>;

  for (const project of projects) {
    for (const state of project.states) {
      counts[state] = (counts[state] ?? 0) + 1;
    }
  }
  return counts;
}

export function getProjectCountsBySector(): Record<Sector, number> {
  const counts: Record<Sector, number> = {
    highway: 0,
    bridge: 0,
    airport: 0,
    rail: 0,
    water: 0,
    industrial: 0,
    coal: 0,
    power: 0,
  };
  for (const project of projects) {
    counts[project.sector] = (counts[project.sector] ?? 0) + 1;
  }
  return counts;
}
