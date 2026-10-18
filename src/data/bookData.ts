import bookDataJson from './bookData.json';
import type {
  ContactInfo,
  BookSpread,
  RoleplayScenario,
  QuizQuestion,
  StickerItem,
} from '../types';

export const defaultContacts: ContactInfo = bookDataJson.defaultContacts;
export const lostModule: BookSpread[] = bookDataJson.lostModule as any;
export const bullyingModule: BookSpread[] = bookDataJson.bullyingModule as any;
export const roleplayScenarios: RoleplayScenario[] = bookDataJson.roleplayScenarios as any;
export const quizQuestions: QuizQuestion[] = bookDataJson.quizQuestions as any;
export const stickers: StickerItem[] = bookDataJson.stickers;

// Sprite coordinate map: [sheet, x, y, width, height, label]
export const Rb: Record<string, [string, number, number, number, number, string]> = {
  friends: ['book', 6, 120, 502, 188, 'Empat anak menyambutmu untuk belajar menjaga diri'],
  'lost-1': ['lost', 56, 430, 432, 258, 'Anak berhenti dengan tenang di depan toko'],
  'lost-2': ['lost', 541, 424, 431, 270, 'Anak meminta bantuan petugas satpam'],
  'lost-3': ['lost', 56, 936, 431, 250, 'Anak menelepon orang tua'],
  'lost-4': ['lost', 542, 936, 431, 248, 'Ponsel dengan tombol bantuan darurat'],
  'bully-1': ['bullying', 58, 426, 429, 258, 'Anak menarik napas dan menenangkan diri'],
  'bully-2': ['bullying', 540, 435, 439, 252, 'Anak menyatakan Aku tidak suka dengan tegas'],
  'bully-3': ['bullying', 56, 925, 432, 240, 'Anak menjauh dari pelaku perundungan'],
  'bully-4': ['bullying', 542, 921, 437, 241, 'Anak melapor kepada ibu guru'],
  boy: ['bullying', 90, 1320, 194, 186, 'Anak tersenyum memberi semangat'],
  girl: ['bullying', 550, 450, 184, 236, 'Anak perempuan yang berani'],
  think: ['lost', 116, 444, 190, 238, 'Anak memperhatikan dengan tenang'],
};

export const _E: Record<string, {
  title: string;
  alt: string;
  points: { x: number; y: number; label: string; text: string }[];
}> = {
  'lost-1': {
    title: 'Berhenti dan tenang',
    alt: 'Budi berhenti di depan toko yang terang dan menenangkan diri.',
    points: [
      { x: 36, y: 57, label: 'Budi', text: 'Aku berhenti di tempat aman. Tarik napas perlahan, lalu hembuskan.' },
      { x: 76, y: 29, label: 'Tempat aman', text: 'Tetap di tempat terang dan ramai agar mudah ditemukan.' }
    ]
  },
  'lost-2': {
    title: 'Cari orang dewasa yang aman',
    alt: 'Budi meminta bantuan satpam berseragam di pusat informasi.',
    points: [
      { x: 66, y: 45, label: 'Satpam', text: 'Aku mencari petugas berseragam di tempat umum untuk meminta bantuan.' },
      { x: 30, y: 67, label: 'Budi', text: 'Permisi, Pak. Saya tersesat. Boleh bantu saya menghubungi orang tua?' }
    ]
  },
  'lost-3': {
    title: 'Hubungi orang tua atau guru',
    alt: 'Budi menelepon orang tua dengan bantuan petugas.',
    points: [
      { x: 40, y: 53, label: 'Telepon', text: 'Aku minta bantuan menghubungi orang tua atau guru.' },
      { x: 76, y: 64, label: 'Tetap aman', text: 'Sambil menunggu, aku tetap bersama petugas di tempat umum.' }
    ]
  },
  'lost-4': {
    title: 'Kenali tombol bantuan',
    alt: 'Budi belajar mengenali tombol bantuan pada tablet bersama guru.',
    points: [
      { x: 53, y: 63, label: 'Tombol bantuan', text: 'Jika membutuhkan pertolongan, aku membuka tombol Bantuan di bawah layar.' },
      { x: 78, y: 35, label: 'Pendamping', text: 'Aku belajar menggunakan tombol bantuan bersama orang dewasa.' }
    ]
  },
  'lost-summary': {
    title: 'Aku tahu cara meminta bantuan',
    alt: 'Budi bertemu kembali dengan ibunya di dekat petugas.',
    points: [
      { x: 34, y: 59, label: 'Ingat langkahnya', text: 'Berhenti dan tenang. Cari petugas. Minta bantuan menghubungi orang tua.' },
      { x: 73, y: 48, label: 'Bersama lagi', text: 'Aku menunggu di tempat aman sampai orang tua atau guru menjemput.' }
    ]
  },
  'bully-1': {
    title: 'Tenangkan dirimu',
    alt: 'Siti menarik napas dengan tenang di taman sekolah.',
    points: [
      { x: 49, y: 49, label: 'Tarik napas', text: 'Aku tarik napas perlahan. Aku boleh merasa sedih, dan aku bisa meminta bantuan.' },
      { x: 73, y: 73, label: 'Tetap tenang', text: 'Aku menenangkan diri dan tidak membalas dengan kekerasan.' }
    ]
  },
  'bully-2': {
    title: 'Berani mengatakan tidak',
    alt: 'Siti mengangkat telapak tangan untuk menunjukkan batas kepada temannya.',
    points: [
      { x: 48, y: 47, label: 'Katakan berhenti', text: 'Berhenti. Aku tidak suka diperlakukan seperti itu.' },
      { x: 24, y: 67, label: 'Sikap tegas', text: 'Aku bicara dengan tegas. Jika tidak aman, aku segera menjauh dan mencari bantuan.' }
    ]
  },
  'bully-3': {
    title: 'Menjauh ke tempat aman',
    alt: 'Siti berjalan menuju guru dan teman yang mendukungnya.',
    points: [
      { x: 41, y: 62, label: 'Menjauh', text: 'Aku menjauh dari perundungan menuju tempat yang aman.' },
      { x: 78, y: 43, label: 'Cari bantuan', text: 'Aku mendekati guru atau teman yang bisa membantuku.' }
    ]
  },
  'bully-4': {
    title: 'Ceritakan kepada guru',
    alt: 'Guru mendengarkan Siti dengan penuh perhatian di kelas.',
    points: [
      { x: 33, y: 58, label: 'Bercerita', text: 'Bu Guru, saya ingin bercerita tentang kejadian yang membuat saya tidak nyaman.' },
      { x: 70, y: 43, label: 'Guru mendengarkan', text: 'Meminta bantuan itu berani. Perundungan bukan salah anak yang mengalaminya.' }
    ]
  },
  'bully-summary': {
    title: 'Aku berhak merasa aman',
    alt: 'Siti bersama guru dan teman-teman yang saling mendukung.',
    points: [
      { x: 35, y: 64, label: 'Empat langkah', text: 'Tenangkan diri. Katakan tidak jika aman. Menjauh. Lapor kepada orang dewasa.' },
      { x: 75, y: 48, label: 'Saling menjaga', text: 'Kita saling menghargai. Semua anak berhak merasa aman.' }
    ]
  }
};
