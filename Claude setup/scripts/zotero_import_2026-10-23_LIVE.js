// Concept catalogue → Zotero import (built by Claude, 23 Oct 2026)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   First run with DRY_RUN = true (nothing changes; it lists what it would do).
//   Then set DRY_RUN = false and run again. Takes ~5 minutes (one DOI lookup at a time).
// What it does (additive only; it never moves, edits or deletes existing items):
//   1. Creates missing sub-folders under Main collection > 3. Food systems.
//   2. Imports each DOI (skips DOIs already in your library) into its folder(s), with open-access PDFs when Zotero finds them.
//   3. Adds already-existing items (by item key) to the same folders.
//   4. Creates hand-entered report items for grey literature without DOIs.
//   Every item touched gets the tag below, so you can review or undo it in one click.

const DRY_RUN = false;   // LIVE: this run changes your library
const TAG = "_cc-import 2026-10-23";     // set to "" for no tag
const SAVE_PDFS = true;
const DELAY_MS = 1500;                   // pause between DOI lookups

// Folder codes → existing collection keys, or [parentKey, "New sub-folder name"] to create.
const FOLDERS = {
  RC:      "K6GER9RP",  // 3.4 > Sustainable agriculture > Regenerative & conservation agriculture
  SCALE:   "5UXVF75E",  // 3.2 > Scaling science
  SCALEAE: "FSX73RNL",  // 3.4 > Agroecology > Scaling agroecology
  BUNDLE:  ["7UVMCVZ9", "Innovation bundles"],                                 // 3.2 > Innovations > (new)
  INTER:   "IZMSSCEQ",  // 3.2 > Innovations > Innovation intermediaries
  TRINTER: "W8WBNATP",  // 3.2 > Transition theory > Intermediaries
  AIS:     "KUXXHVEL",  // 3.2 > Innovations > Agricultural Innovation System
  LINK:    ["WMC8FS8W", "Market linkages & smallholder market access"],        // 3.5 > (new)
  MSD:     ["WMC8FS8W", "Market systems & market systems development (M4P)"],  // 3.5 > (new)
  IVC:     ["WMC8FS8W", "Inclusive value chains & business models"],          // 3.5 > (new)
  VN:      "P48DNEH6",  // 3.8 > Food systems in Vietnam
  ASIA:    "A52PPE4T",  // 3.8 > Food systems in Asia
  LAO:     "XYNUVPAE",  // 3.8 > Food systems in Asia > Lao PDR
};
const EXTRA = { SCALEAE: ["SCALE"], LAO: ["ASIA"] };  // codes that also imply other folders

const DATA = {
 "dois": [
  {
   "doi": "10.3389/fsufs.2022.844261",
   "tags": [
    "RC"
   ],
   "note": "B10 Tittonell 2022"
  },
  {
   "doi": "10.1088/1748-9326/ac8609",
   "tags": [
    "RC"
   ],
   "note": "B10 Jordon 2022"
  },
  {
   "doi": "10.3390/su15032338",
   "tags": [
    "RC"
   ],
   "note": "B10 Khangura 2023"
  },
  {
   "doi": "10.1007/s10460-023-10429-3",
   "tags": [
    "RC"
   ],
   "note": "B10 Sands 2023"
  },
  {
   "doi": "10.1016/j.agee.2023.108450",
   "tags": [
    "RC",
    "ASIA"
   ],
   "note": "B10 Tan 2023"
  },
  {
   "doi": "10.3389/fsufs.2021.712733",
   "tags": [
    "RC",
    "VN"
   ],
   "note": "B10 Le 2021"
  },
  {
   "doi": "10.1007/s10460-023-10444-4",
   "tags": [
    "RC"
   ],
   "note": "B10 Bless 2023"
  },
  {
   "doi": "10.1007/s11625-022-01281-1",
   "tags": [
    "RC"
   ],
   "note": "B10 Gordon 2023"
  },
  {
   "doi": "10.1016/j.gloenvcha.2019.101965",
   "tags": [
    "RC"
   ],
   "note": "B10 Gosnell 2019"
  },
  {
   "doi": "10.7717/peerj.4428",
   "tags": [
    "RC"
   ],
   "note": "B10 LaCanne 2018"
  },
  {
   "doi": "10.3390/su152215941",
   "tags": [
    "RC"
   ],
   "note": "B10 Jayasinghe 2023"
  },
  {
   "doi": "10.2489/jswc.2020.0620a",
   "tags": [
    "RC"
   ],
   "note": "B10 Lal 2020"
  },
  {
   "doi": "10.1088/2515-7620/acd6dc",
   "tags": [
    "RC"
   ],
   "note": "B10 Rehberger 2023"
  },
  {
   "doi": "10.3763/ijas.2009.0477",
   "tags": [
    "RC"
   ],
   "note": "B19 Kassam 2009"
  },
  {
   "doi": "10.1016/j.fcr.2009.06.017",
   "tags": [
    "RC"
   ],
   "note": "B19 Giller 2009"
  },
  {
   "doi": "10.1038/nature13809",
   "tags": [
    "RC"
   ],
   "note": "B19 Pittelkow 2014"
  },
  {
   "doi": "10.1038/s43016-020-0114-x",
   "tags": [
    "RC"
   ],
   "note": "B19 Corbeels 2020"
  },
  {
   "doi": "10.1016/j.agee.2013.08.010",
   "tags": [
    "RC"
   ],
   "note": "B19 Brouder 2014"
  },
  {
   "doi": "10.1016/j.foodpol.2006.01.003",
   "tags": [
    "RC"
   ],
   "note": "B19 Knowler 2007"
  },
  {
   "doi": "10.1098/rstb.2007.2169",
   "tags": [
    "RC"
   ],
   "note": "B19 Hobbs 2007"
  },
  {
   "doi": "10.1080/00207233.2018.1494927",
   "tags": [
    "RC"
   ],
   "note": "B19 Kassam 2018"
  },
  {
   "doi": "10.1016/j.agee.2013.10.010",
   "tags": [
    "RC"
   ],
   "note": "B19 Palm 2014"
  },
  {
   "doi": "10.1017/s174217051500037x",
   "tags": [
    "RC",
    "LAO"
   ],
   "note": "B19 Husson 2015"
  },
  {
   "doi": "10.1017/s174217051100055x",
   "tags": [
    "RC",
    "LAO"
   ],
   "note": "B19 Lestrelin 2011"
  },
  {
   "doi": "10.1016/j.still.2019.104349",
   "tags": [
    "RC",
    "ASIA"
   ],
   "note": "B19 Pheap 2019"
  },
  {
   "doi": "10.1007/s10460-016-9718-z",
   "tags": [
    "RC",
    "ASIA"
   ],
   "note": "B19 Sumner 2016"
  },
  {
   "doi": "10.1038/s41467-018-05956-1",
   "tags": [
    "RC"
   ],
   "note": "B19 Knapp 2018"
  },
  {
   "doi": "10.1016/0305-750X(95)00028-B",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Uvin 1995"
  },
  {
   "doi": "10.1016/j.agsy.2020.102874",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Sartas 2020"
  },
  {
   "doi": "10.1016/j.agsy.2020.102908",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Schut 2020"
  },
  {
   "doi": "10.1016/j.agsy.2018.07.007",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Westermann 2018"
  },
  {
   "doi": "10.1016/j.cosust.2013.10.013",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Coe 2014"
  },
  {
   "doi": "10.1007/978-94-007-5449-2_1",
   "tags": [
    "SCALEAE"
   ],
   "note": "H06 Altieri 2012"
  },
  {
   "doi": "10.1007/s10460-009-9194-9",
   "tags": [
    "SCALE",
    "LAO"
   ],
   "note": "H06 Millar 2009"
  },
  {
   "doi": "10.3390/agronomy11091707",
   "tags": [
    "SCALE",
    "VN"
   ],
   "note": "H06 Flor 2021"
  },
  {
   "doi": "10.3389/fsufs.2021.675818",
   "tags": [
    "SCALE",
    "ASIA"
   ],
   "note": "H06 Enriquez 2021"
  },
  {
   "doi": "10.1177/0030727020960165",
   "tags": [
    "SCALE",
    "VN"
   ],
   "note": "H06 Connor 2020"
  },
  {
   "doi": "10.1016/j.agsy.2019.102770",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Low 2020"
  },
  {
   "doi": "10.1177/0030727019864978",
   "tags": [
    "SCALE"
   ],
   "note": "H06 Glover 2019"
  },
  {
   "doi": "10.1007/978-3-030-88802-2",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Barrett 2022"
  },
  {
   "doi": "10.2307/1241177",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Feder 1982"
  },
  {
   "doi": "10.1086/451461",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Feder 1985"
  },
  {
   "doi": "10.1016/j.techfore.2008.10.001",
   "tags": [
    "INTER"
   ],
   "note": "G18 Klerkx 2009"
  },
  {
   "doi": "10.1504/IJARGE.2009.032643",
   "tags": [
    "INTER"
   ],
   "note": "G18 Klerkx 2009"
  },
  {
   "doi": "10.1016/j.agsy.2023.103843",
   "tags": [
    "INTER",
    "ASIA"
   ],
   "note": "G18 Valerio 2024"
  },
  {
   "doi": "10.1080/19761597.2013.810949",
   "tags": [
    "INTER",
    "ASIA"
   ],
   "note": "G18 Intarakumnerd 2013"
  },
  {
   "doi": "10.1080/2157930x.2011.615601",
   "tags": [
    "INTER"
   ],
   "note": "G18 Szogs 2011"
  },
  {
   "doi": "10.1016/j.techfore.2023.122351",
   "tags": [
    "INTER"
   ],
   "note": "G18 Caloffi 2023"
  },
  {
   "doi": "10.1007/978-94-007-4503-2_20",
   "tags": [
    "INTER",
    "AIS"
   ],
   "note": "G18 Klerkx 2012"
  },
  {
   "doi": "10.1016/j.agsy.2009.12.004",
   "tags": [
    "INTER"
   ],
   "note": "G18 Poncet 2010"
  },
  {
   "doi": "10.1016/j.gloenvcha.2013.02.008",
   "tags": [
    "TRINTER"
   ],
   "note": "G18 Hargreaves 2013"
  },
  {
   "doi": "10.1016/j.worlddev.2017.11.015",
   "tags": [
    "LINK"
   ],
   "note": "C25 Ton 2018"
  },
  {
   "doi": "10.1016/j.worlddev.2011.11.018",
   "tags": [
    "LINK"
   ],
   "note": "C25 Fischer 2012"
  },
  {
   "doi": "10.1016/j.worlddev.2011.09.006",
   "tags": [
    "LINK"
   ],
   "note": "C25 Barrett 2012"
  },
  {
   "doi": "10.1016/j.worlddev.2011.12.008",
   "tags": [
    "LINK"
   ],
   "note": "C25 Bellemare 2012"
  },
  {
   "doi": "10.1016/j.foodpol.2008.10.003",
   "tags": [
    "LINK"
   ],
   "note": "C25 Hellin 2009"
  },
  {
   "doi": "10.1016/j.eap.2024.05.005",
   "tags": [
    "LINK"
   ],
   "note": "C25 Ma 2024"
  },
  {
   "doi": "10.3390/su11143799",
   "tags": [
    "LINK",
    "VN"
   ],
   "note": "C25 Hung Anh 2019"
  },
  {
   "doi": "10.1016/j.jenvman.2024.122536",
   "tags": [
    "LINK",
    "ASIA"
   ],
   "note": "C25 Touch 2024"
  },
  {
   "doi": "10.1111/j.1541-1338.2010.00462.x",
   "tags": [
    "LINK"
   ],
   "note": "C25 Markelova 2010"
  },
  {
   "doi": "10.3362/0957-1329.2006.041",
   "tags": [
    "MSD"
   ],
   "note": "C27 Jörg Meyer-Stamer 2006"
  },
  {
   "doi": "10.3362/1755-1986.2008.012",
   "tags": [
    "MSD"
   ],
   "note": "C27 Harald Bekkers 2008"
  },
  {
   "doi": "10.3362/1755-1986.2009.034",
   "tags": [
    "MSD"
   ],
   "note": "C27 Linda Jones 2009"
  },
  {
   "doi": "10.3362/1755-1986.30-4.CF",
   "tags": [
    "MSD"
   ],
   "note": "C27 Prudence Beignet 2019"
  },
  {
   "doi": "10.3362/1755-1986.2008.011",
   "tags": [
    "MSD"
   ],
   "note": "C27 David Elliot 2008"
  },
  {
   "doi": "10.1016/j.worlddev.2018.02.036",
   "tags": [
    "MSD"
   ],
   "note": "C27 Kuhl 2018"
  },
  {
   "doi": "10.1111/j.2040-0217.2010.00063_2.x",
   "tags": [
    "MSD"
   ],
   "note": "C27 Humphrey 2010"
  },
  {
   "doi": "10.1080/01436597.2013.868982",
   "tags": [
    "MSD"
   ],
   "note": "C27 Blowfield 2014"
  },
  {
   "doi": "10.3390/su132011210",
   "tags": [
    "MSD"
   ],
   "note": "C26 Choptiany 2021"
  },
  {
   "doi": "10.1108/jadee-06-2017-0065",
   "tags": [
    "IVC"
   ],
   "note": "C29 Devaux 2018"
  },
  {
   "doi": "10.1016/j.jclepro.2020.124062",
   "tags": [
    "IVC"
   ],
   "note": "C29 Schoneveld 2020"
  },
  {
   "doi": "10.1111/raq.12415",
   "tags": [
    "IVC"
   ],
   "note": "C29 Kaminski 2020"
  },
  {
   "doi": "10.1057/ejdr.2015.50",
   "tags": [
    "IVC"
   ],
   "note": "C29 Ros-Tonen 2015"
  },
  {
   "doi": "10.1016/j.worlddev.2023.106187",
   "tags": [
    "IVC"
   ],
   "note": "C29 Oberlack 2023"
  },
  {
   "doi": "10.1016/j.landusepol.2023.106676",
   "tags": [
    "IVC"
   ],
   "note": "C29 Schoneveld 2023"
  },
  {
   "doi": "10.1080/14735903.2024.2322193",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Abetu 2024"
  },
  {
   "doi": "10.1007/s11205-019-02166-0",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Biru 2020"
  },
  {
   "doi": "10.1111/agec.12806",
   "tags": [
    "BUNDLE"
   ],
   "note": "H05 Mishra 2023"
  }
 ],
 "existing": [
  {
   "key": "2FMD6PPJ",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "2GTQCN6P",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "3B5KSQR9",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "3ECT6WN4",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "3EWI37TP",
   "tags": [
    "BUNDLE"
   ]
  },
  {
   "key": "3VLIP667",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "45T4PNBF",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "4M8V437N",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "4X5IRLGI",
   "tags": [
    "INTER",
    "SCALE"
   ]
  },
  {
   "key": "4ZHE6PMM",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "5X66JKX8",
   "tags": [
    "BUNDLE"
   ]
  },
  {
   "key": "6BHXFXQI",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "77EWLJ95",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "7DTQXW6R",
   "tags": [
    "LINK"
   ]
  },
  {
   "key": "9H5S7B8T",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "A4D6GUVU",
   "tags": [
    "LINK"
   ]
  },
  {
   "key": "AKPWT7IB",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "AUY4TVTA",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "B7G6I6RT",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "BAYFSYV6",
   "tags": [
    "LINK",
    "MSD"
   ]
  },
  {
   "key": "BQE5W9H2",
   "tags": [
    "INTER",
    "VN"
   ]
  },
  {
   "key": "C2424YKR",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "CHHBN5ZR",
   "tags": [
    "IVC",
    "VN"
   ]
  },
  {
   "key": "CI5Z354D",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "D67PT333",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "DAQ9P4K3",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "DCYPLF32",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "EACCGUMG",
   "tags": [
    "LINK"
   ]
  },
  {
   "key": "EVG329NJ",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "FJUGWI9P",
   "tags": [
    "LINK"
   ]
  },
  {
   "key": "FXLHJS5C",
   "tags": [
    "LINK",
    "VN"
   ]
  },
  {
   "key": "G4FY22J8",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "H6XD4VMP",
   "tags": [
    "ASIA",
    "INTER"
   ]
  },
  {
   "key": "HSX9BINC",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "I725AMC7",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "IEJE5P3V",
   "tags": [
    "ASIA",
    "SCALE"
   ]
  },
  {
   "key": "IHFLXAJV",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "ILPPIFXH",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "IYEJXJT7",
   "tags": [
    "INTER",
    "RC",
    "SCALE"
   ]
  },
  {
   "key": "J4BPMVL8",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "JPNHITRP",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "K6KYBE8L",
   "tags": [
    "ASIA",
    "LINK"
   ]
  },
  {
   "key": "KA7477PT",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "KBNJJUY9",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "KYRZM33F",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "L2A9GD47",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "MB8HKUR2",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "MBBF6FU3",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "MCIE4JHS",
   "tags": [
    "LINK",
    "MSD"
   ]
  },
  {
   "key": "MFH6ZEEF",
   "tags": [
    "RC",
    "VN"
   ]
  },
  {
   "key": "NHYG7IYC",
   "tags": [
    "LINK",
    "MSD"
   ]
  },
  {
   "key": "NPB9F4WA",
   "tags": [
    "SCALE",
    "VN"
   ]
  },
  {
   "key": "PIPNYET8",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "PNZA872S",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "QB9RKDWS",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "QE8YCWSJ",
   "tags": [
    "RC",
    "VN"
   ]
  },
  {
   "key": "QEK7AJZT",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "QGR4GZVE",
   "tags": [
    "MSD"
   ]
  },
  {
   "key": "R3KXLRJZ",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "RGJTU7TB",
   "tags": [
    "INTER",
    "SCALE"
   ]
  },
  {
   "key": "SFHUD3RE",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "SMXJA52X",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "SVU4SXCU",
   "tags": [
    "LINK"
   ]
  },
  {
   "key": "SYGK42DW",
   "tags": [
    "BUNDLE",
    "SCALE"
   ]
  },
  {
   "key": "UQ2R6XZ2",
   "tags": [
    "BUNDLE"
   ]
  },
  {
   "key": "VF8MRNNS",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "W4QU2UD9",
   "tags": [
    "RC",
    "SCALE"
   ]
  },
  {
   "key": "WHFJRRNE",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "WNVDTVLZ",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "WPLX6QKQ",
   "tags": [
    "IVC"
   ]
  },
  {
   "key": "WQ3VXVIP",
   "tags": [
    "BUNDLE"
   ]
  },
  {
   "key": "X66FRRTJ",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "YH3KTZNU",
   "tags": [
    "BUNDLE",
    "SCALE"
   ]
  },
  {
   "key": "YIJGSVCU",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "YQLKG4DQ",
   "tags": [
    "INTER"
   ]
  },
  {
   "key": "Z8IEL5Z8",
   "tags": [
    "SCALE"
   ]
  },
  {
   "key": "ZII7FRQR",
   "tags": [
    "INTER",
    "VN"
   ]
  },
  {
   "key": "ZSGAFBSK",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "ZT55VK9Q",
   "tags": [
    "IVC"
   ]
  }
 ],
 "manual": [
  {
   "type": "report",
   "tags": [
    "MSD"
   ],
   "title": "Review of Making Markets Work for the Poor (M4P) evaluation methods and approaches",
   "creators": [
    [
     "Tim",
     "Ruffer"
    ],
    [
     "Elise",
     "Wach"
    ]
   ],
   "date": "2013",
   "institution": "Department for International Development",
   "reportNumber": "Working Paper 41",
   "extra": ""
  },
  {
   "type": "report",
   "tags": [
    "MSD",
    "ASIA"
   ],
   "title": "Synthesis review of DFAT-funded market systems development initiatives",
   "creators": [
    [
     "Bob",
     "Warner"
    ],
    [
     "Donna",
     "Loveridge"
    ]
   ],
   "date": "",
   "institution": "Department of Foreign Affairs and Trade",
   "reportNumber": "",
   "url": "https://www.dfat.gov.au/sites/default/files/market-systems-development-synthesis-review-final.pdf",
   "extra": "Year not printed; latest sources cited 2019 (c. 2020)."
  },
  {
   "type": "report",
   "tags": [
    "MSD"
   ],
   "title": "The results achieved by programmes that use the MSD approach: BEAM evidence review 2024",
   "creators": [
    [
     "Tom",
     "Hilton"
    ]
   ],
   "date": "2024",
   "institution": "BEAM Exchange",
   "reportNumber": "",
   "url": "https://beamexchange.org/",
   "extra": "Reviews 72 documents published 2021-2024."
  },
  {
   "type": "report",
   "tags": [
    "MSD"
   ],
   "title": "Market systems resilience: A framework for measurement",
   "creators": [
    [
     "Jeanne",
     "Downing"
    ],
    [
     "Mike",
     "Field"
    ],
    [
     "Matt",
     "Ripley"
    ],
    [
     "Jennefer",
     "Sebstad"
    ]
   ],
   "date": "2019",
   "institution": "USAID",
   "reportNumber": "",
   "extra": "Verify year (2018 or 2019) and full author names."
  },
  {
   "type": "report",
   "tags": [
    "MSD"
   ],
   "title": "The operational guide for the Making Markets Work for the Poor (M4P) approach",
   "creators": [
    [
     "",
     "The Springfield Centre"
    ]
   ],
   "date": "2015",
   "institution": "SDC; DFID",
   "reportNumber": "2nd edition",
   "extra": "Verify edition and year."
  },
  {
   "type": "report",
   "tags": [
    "SCALE"
   ],
   "title": "Scaling up: A framework and lessons for development effectiveness from literature and practice",
   "creators": [
    [
     "Arntraud",
     "Hartmann"
    ],
    [
     "Johannes F.",
     "Linn"
    ]
   ],
   "date": "2008",
   "institution": "Wolfensohn Center for Development at Brookings",
   "reportNumber": "Working Paper 5",
   "extra": ""
  },
  {
   "type": "report",
   "tags": [
    "IVC"
   ],
   "title": "LINK methodology: A participatory guide to business models that link smallholders to markets",
   "creators": [
    [
     "Mark",
     "Lundy"
    ],
    [
     "Gertjan",
     "Becx"
    ],
    [
     "Nancy",
     "Zamierowski"
    ],
    [
     "Alexandra",
     "Amrein"
    ],
    [
     "Jhon Jairo",
     "Hurtado"
    ],
    [
     "Erika Eliana",
     "Mosquera"
    ],
    [
     "Fernando",
     "Rodríguez"
    ]
   ],
   "date": "2012",
   "institution": "International Center for Tropical Agriculture (CIAT)",
   "place": "Cali, Colombia",
   "reportNumber": "",
   "url": "https://hdl.handle.net/10568/49605",
   "extra": ""
  },
  {
   "type": "report",
   "tags": [
    "INTER",
    "ASIA"
   ],
   "title": "Division of labour amongst innovation intermediaries in agricultural innovation systems: The case of Indonesia",
   "creators": [
    [
     "Nobuya",
     "Fukugawa"
    ],
    [
     "Masahito",
     "Ambashi"
    ],
    [
     "Yuanita",
     "Suhud"
    ]
   ],
   "date": "2018",
   "institution": "Economic Research Institute for ASEAN and East Asia (ERIA)",
   "reportNumber": "ERIA-DP-2018-06",
   "url": "https://www.eria.org/research/division-of-labour-amongst-innovation-intermediaries-in-agricultural-innovation-systems-the-case-of-indonesia",
   "extra": ""
  }
 ]
};

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-import] " + s); };
const colIDs = {};

async function folderID(code) {
  if (colIDs[code]) return colIDs[code];
  const spec = FOLDERS[code];
  if (!spec) throw new Error("Unknown folder code " + code);
  let col;
  if (typeof spec === "string") {
    col = Zotero.Collections.getByLibraryAndKey(lib, spec);
    if (!col) throw new Error(`Collection key ${spec} (${code}) not found`);
  } else {
    const parent = Zotero.Collections.getByLibraryAndKey(lib, spec[0]);
    if (!parent) throw new Error(`Parent key ${spec[0]} not found`);
    col = parent.getChildCollections().find(c => c.name === spec[1]);
    if (!col) {
      if (DRY_RUN) { say(`WOULD CREATE folder "${spec[1]}" under "${parent.name}"`); colIDs[code] = -1; return -1; }
      col = new Zotero.Collection({ libraryID: lib, name: spec[1], parentID: parent.id });
      await col.saveTx();
      say(`Created folder "${spec[1]}" under "${parent.name}"`);
    }
  }
  colIDs[code] = col.id;
  return col.id;
}
function expand(codes) {
  const s = new Set(codes);
  codes.forEach(c => (EXTRA[c] || []).forEach(x => s.add(x)));
  return [...s];
}
async function folderIDs(codes) { const out = []; for (const c of expand(codes)) out.push(await folderID(c)); return out; }
async function findByDOI(doi) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("DOI", "contains", doi);
  const ids = await s.search();
  return Zotero.Items.get(ids).filter(i => !i.deleted && (i.getField("DOI") || "").toLowerCase().trim() === doi.toLowerCase());
}
async function fileItem(item, ids) {
  let changed = false;
  for (const id of ids) if (id > 0 && !item.inCollection(id)) { item.addToCollection(id); changed = true; }
  if (TAG && !item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
  if (changed) await item.saveTx();
  return changed;
}

let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nMan = 0;

// 1-2. DOIs
for (const d of DATA.dois) {
  const ids = await folderIDs(d.tags);
  const have = await findByDOI(d.doi);
  if (have.length) {
    nSkip++;
    if (DRY_RUN) { say(`ALREADY IN LIBRARY ${d.doi} (${d.note}) → would file into ${d.tags}`); continue; }
    await fileItem(have[0], ids);
    say(`Already in library, filed: ${d.doi} (${d.note})`);
    continue;
  }
  if (DRY_RUN) { say(`WOULD IMPORT ${d.doi} (${d.note}) → ${d.tags}`); continue; }
  try {
    const tr = new Zotero.Translate.Search();
    tr.setIdentifier({ DOI: d.doi });
    const translators = await tr.getTranslators();
    if (!translators.length) throw new Error("no translator");
    tr.setTranslator(translators);
    const items = await tr.translate({ libraryID: lib, collections: ids.filter(i => i > 0), saveAttachments: SAVE_PDFS });
    for (const it of items) if (TAG) { it.addTag(TAG); await it.saveTx(); }
    nImp++;
    say(`Imported ${d.doi} (${d.note}): ${items.map(i => i.getField("title")).join("; ").slice(0, 90)}`);
  } catch (e) {
    nFail++;
    say(`FAILED ${d.doi} (${d.note}): ${e}`);
  }
  await Zotero.Promise.delay(DELAY_MS);
}

// 3. Existing items by key
for (const x of DATA.existing) {
  const item = Zotero.Items.getByLibraryAndKey(lib, x.key);
  if (!item) { say(`MISSING item key ${x.key}`); continue; }
  const ids = await folderIDs(x.tags);
  if (DRY_RUN) { say(`WOULD FILE existing ${x.key} "${item.getField("title").slice(0, 70)}" → ${x.tags}`); continue; }
  if (await fileItem(item, ids)) nFiled++;
}

// 4. Grey literature
for (const m of DATA.manual) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("title", "is", m.title);
  const dup = (await s.search()).length;
  if (dup) { say(`Report already exists, skipped: ${m.title.slice(0, 70)}`); continue; }
  if (DRY_RUN) { say(`WOULD CREATE report "${m.title.slice(0, 70)}" → ${m.tags}`); continue; }
  const it = new Zotero.Item(m.type);
  it.libraryID = lib;
  it.setField("title", m.title);
  if (m.date) it.setField("date", m.date);
  if (m.institution) it.setField("institution", m.institution);
  if (m.reportNumber) it.setField("reportNumber", m.reportNumber);
  if (m.place) it.setField("place", m.place);
  if (m.url) it.setField("url", m.url);
  if (m.extra) it.setField("extra", m.extra);
  it.setCreators(m.creators.map(([f, l]) => f ? { firstName: f, lastName: l, creatorType: "author" } : { name: l, creatorType: "author", fieldMode: 1 }));
  for (const id of await folderIDs(m.tags)) if (id > 0) it.addToCollection(id);
  if (TAG) it.addTag(TAG);
  await it.saveTx();
  nMan++;
  say(`Created report: ${m.title.slice(0, 70)}`);
}

say(`\n${DRY_RUN ? "DRY RUN — nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items filed ${nFiled}, reports created ${nMan}.`);
if (nFail) say("Failed DOIs: add them by hand with the magic wand (Add Item by Identifier).");
return log.join("\n");
