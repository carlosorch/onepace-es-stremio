// src/data/arc-images.ts
// Maps arc part numbers to curated One Pace backdrop images from onepace.net
// These are served via Next.js image optimization at various sizes

const ONEPACE_BASE = 'https://onepace.net/_next/image?url=';
const IMG_PARAMS = '&w=640&q=75'; // 640px wide, 75% quality — good for thumbnails

function opImg(path: string): string {
  return `${ONEPACE_BASE}${encodeURIComponent(path)}${IMG_PARAMS}`;
}

/**
 * Arc backdrop images extracted from onepace.net/en/watch
 * Each arc maps to one representative screenshot from One Pace episodes
 */
export const ARC_THUMBNAILS: Record<number, string> = {
  // Part 0: Specials
  0: opImg('/_next/static/media/50-backdrop-village-cows.08_kgczvbw9m8.jpg'),

  // Part 1: Romance Dawn
  1: opImg('/_next/static/media/50-backdrop-village-cows.08_kgczvbw9m8.jpg'),

  // Part 2: Orange Town
  2: opImg('/_next/static/media/50-backdrop-One_Pace12-19_Orange_Town_02_1080pC0A5D51D.mkv_snapshot_11.55.887.05naha4yf.-bw.jpg'),

  // Part 3: Syrup Village
  3: opImg('/_next/static/media/50-backdrop-Syrup1QC.mkv_snapshot_12.14.301.121rtr~3mf858.jpg'),

  // Part 4: Gaimon
  4: opImg('/_next/static/media/50-backdrop-One_Pace4222_Gaimon_01_1080p0C2DBF75.mkv_snapshot_14.53.836.0woia7slyffwm.jpg'),

  // Part 5: Baratie
  5: opImg('/_next/static/media/50-backdrop-One_Pace42-44_Baratie_01_1080pCC37D6C6.mkv_snapshot_27.49.361.12szu.zvrbjm5.jpg'),

  // Part 6: Arlong Park
  6: opImg('/_next/static/media/50-backdrop-One_Pace69-71_Arlong_Park_01_PJ_QC.mkv_snapshot_17.19.857.0rtzezmz87_o5.jpg'),

  // Part 7: The Adventures of Buggy's Crew
  7: opImg('/_next/static/media/50-backdrop-One_Pace35-75_The_Adventures_of_Buggys_Crew_1080pE75794DB.mkv_snapshot_02.31.042.0fztz3y3l8pzy.jpg'),

  // Part 8: Loguetown
  8: opImg('/_next/static/media/50-backdrop-One_Piece_-_0048_-_The_Town_of_the_Beginning_and_the_End_Landfall_at_Logue_Town_v21080px264AC3SUB-df68.mkv_snapshot_04.24.627.0k7mwwiu.l.o-.jpg'),

  // Part 9: Reverse Mountain
  9: opImg('/_next/static/media/50-backdrop-One_Pace101-102_Reverse_Mountain_01_PJ_QC.mkv_snapshot_19.16.293.04s~l5gchjvfu.jpg'),

  // Part 10: Whisky Peak
  10: opImg('/_next/static/media/50-backdrop-One_Pace106-108_Whisky_Peak_01_PJ_QC.mkv_snapshot_08.14.084.0xoa5yf~f8egy.jpg'),

  // Part 11: The Trials of Koby-Meppo
  11: opImg('/_next/static/media/50-backdrop-One_Pace83-119_The_Trials_of_Koby-Meppo_1080p4B56844F.mkv_snapshot_06.27.162.00l3b5pstmhy2.jpg'),

  // Part 12: Little Garden
  12: opImg('/_next/static/media/50-backdrop-One_Pace115-117_Little_Garden_01_PJ_QC.mkv_snapshot_06.09.369.14n086lht1xlb.jpg'),

  // Part 13: Drum Island
  13: opImg('/_next/static/media/50-backdrop-One_Pace129-132_Drum_Island_01_1080pFD2B4F32.mkv_snapshot_23.13.390.0sw6rskkmp4kn.jpg'),

  // Part 14: Alabasta
  14: opImg('/_next/static/media/50-backdrop-One_Pace164-166_Arabasta_05_Batch_QC.mkv_snapshot_18.19.582.0dsrj3fkoe2ix.jpg'),

  // Part 15: Jaya
  15: opImg('/_next/static/media/50-backdrop-One_Pace225-226_Jaya_03_1080pB4950266.mkv_snapshot_13.53.790.0tpre5i6i-e2q.jpg'),

  // Part 16: Skypiea
  16: opImg('/_next/static/media/50-backdrop-One_Pace237-238_Skypiea_01_1080pCA5552FC.mkv_snapshot_09.09.803.0o9v-v.s-~v.3.jpg'),

  // Part 17: Long Ring Long Land
  17: opImg('/_next/static/media/50-backdrop-One_Pace303-306_Long_Ring_Long_Land_02_Timing.mkv_snapshot_05.10.965.07xelj3eac~i6.jpg'),

  // Part 18: Water Seven
  18: opImg('/_next/static/media/50-backdrop-One_Pace324-326_Water_Seven_02_1080p763C1FA8.mkv_snapshot_06.37.283.0bn52n7sxbutw.jpg'),

  // Part 19: Enies Lobby
  19: opImg('/_next/static/media/50-backdrop-enieslobby_03.mkv_snapshot_07.20.809.152zw62s66832.jpg'),

  // Part 20: Post-Enies Lobby
  20: opImg('/_next/static/media/50-backdrop-431-432_Post-Enies_Lobby_01.regions.mkv_snapshot_14.42.148.17zs8uw0xo3uj.jpg'),

  // Part 21: Thriller Bark
  21: opImg('/_next/static/media/50-backdrop-One_Pace442-443_Thriller_Bark_01_720p30D0916C.mkv_snapshot_26.53.600.06q8kx~v56zc~.jpg'),

  // Part 22: Sabaody Archipelago
  22: opImg('/_next/static/media/50-backdrop-One_Pace496-497_Sabaody_Archipelago_04_720p76D21468.mkv_snapshot_14.43.805.0axpp8eanqix1.jpg'),

  // Part 23: Amazon Lily
  23: opImg('/_next/static/media/50-backdrop-One_Pace520-522_Amazon_Lily_04_720pA5F0A507.mkv_snapshot_22.39.969.0c7kyv.5s.jnw.jpg'),

  // Part 24: Impel Down
  24: opImg('/_next/static/media/50-backdrop-One_Pace525-526_Impel_Down_01_1080p_QC_v2A3EC45CC.mkv_snapshot_19.32.688.0qlymdmdrkmtu.jpg'),

  // Part 25: The Adventures of the Straw Hats
  25: opImg('/_next/static/media/50-backdrop-One_Pace549-550_Marineford_01_720pC9143FCD.mkv_snapshot_11.23.472.04s43fy4u4xka.jpg'),

  // Part 26: Marineford
  26: opImg('/_next/static/media/50-backdrop-One_Pace549-550_Marineford_01_720pC9143FCD.mkv_snapshot_18.29.183.0s5yty_4kyme_.jpg'),

  // Part 27: Post-War
  27: opImg('/_next/static/media/50-backdrop-One_Pace583-584_Post-War_02_1080p1A183CBE.mkv_snapshot_09.17.273.09h3t_l3uj~54.jpg'),

  // Part 28: Return to Sabaody
  28: opImg('/_next/static/media/50-backdrop-One_Pace598-599_Return_to_Sabaody_01_1080p5FBDCD0F.mkv_snapshot_09.06.108.06ukwbr~za3c7.jpg'),

  // Part 29: Fishman Island
  29: opImg('/_next/static/media/50-backdrop-One_Pace607-608_Fishman_Island_03_720p5636E014.mkv_snapshot_07.20.485.0u-b5np8x-vmw.jpg'),

  // Part 30: Punk Hazard
  30: opImg('/_next/static/media/50-backdrop-PH1QC.mp4_snapshot_11.02.464.0h_wyb4.7yz5~.jpg'),

  // Part 31: Dressrosa
  31: opImg('/_next/static/media/50-backdrop-One_Pace700-701_Dressrosa_01_PJ_QC.mkv_snapshot_17.18.819.12w6v~t3xs6am.jpg'),

  // Part 32: Zou
  32: opImg('/_next/static/media/50-backdrop-Zou03_PJQC.mkv_snapshot_04.02.486.12-gyngu-ze~r.jpg'),

  // Part 33: Whole Cake Island
  33: opImg('/_next/static/media/50-backdrop-cover-whole-cake-island-08.03.l.3qozrg5r.jpg'),

  // Part 34: Reverie
  34: opImg('/_next/static/media/50-backdrop-One_Pace903-904_Reverie_01_1080pA4325AC2.mkv_snapshot_00.36.425.0v0.mq3by0~d6.jpg'),

  // Part 35: Wano (use a Marineford backdrop as fallback — Wano images not in scraped page)
  35: opImg('/_next/static/media/50-backdrop-One_Pace549-550_Marineford_01_720pC9143FCD.mkv_snapshot_24.01.022.0~q_ohlwca2p6.jpg'),

  // Part 36: Egghead
  36: opImg('/_next/static/media/50-backdrop-One_Pace1060-1061_Egghead_03_1080p979285FE.mkv_snapshot_24.05.360.0bnvi20skkjj0.jpg'),
};

/**
 * Get the thumbnail URL for a given arc part number.
 * Falls back to the Romance Dawn image if no mapping is found.
 */
export function getArcThumbnail(part: number): string {
  return ARC_THUMBNAILS[part] || ARC_THUMBNAILS[1];
}
