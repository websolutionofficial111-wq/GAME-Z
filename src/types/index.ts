export type GameType = 'Valorant' | 'BGMI / PUBG' | 'Free Fire' | 'EA FC' | 'Apex Legends';

export type TournamentStatus = 'live' | 'scheduled' | 'open' | 'completed';

export interface BracketTeam {
  id: string;
  name: string;
  tag: string;
  seed: number;
  score?: number;
  isWinner?: boolean;
  avatarBg?: string;
}

export interface BracketMatch {
  id: string;
  roundName: 'Quarterfinals' | 'Semifinals' | 'Grand Finals';
  roundNumber: number;
  matchIndex: number;
  teamA: BracketTeam;
  teamB: BracketTeam;
  status: 'completed' | 'live' | 'upcoming';
  scheduledTime: string;
  mapPicked?: string;
  bestOf: number;
  winnerId?: string;
}

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  game: GameType;
  gameInitial: string;
  gameBgColor: string;
  status: TournamentStatus;
  prizePool: string;
  prizePoolNumeric: number;
  startTime: string;
  totalSlots: number;
  filledSlots: number;
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  entryFee: string;
  format: string;
  serverRegion: string;
  description: string;
  bracket: BracketMatch[];
}

export interface PlayerProofOfPlay {
  id: string;
  game: GameType;
  gameInitial: string;
  gameBgColor: string;
  tournament: string;
  placement: string;
  rpChange: string;
  isPositive: boolean;
  date: string;
}

export interface PerformanceTrendPoint {
  date: string;
  winRate: number;
  rp: number;
  matches: number;
  wins: number;
}

export interface PlayerProfile {
  name: string;
  gamerTag: string;
  playerId: string;
  rank: string;
  rankPoints: number;
  rankPointsMax: number;
  level: number;
  xp: number;
  xpToNext: number;
  location: string;
  role: string;
  squadName: string;
  squadPower: number;
  matchesPlayed: number;
  wins: number;
  winRate: number;
  totalWinnings: string;
  winningsThisMonth: string;
  trustScore: number;
  badges: string[];
  recentMatches: PlayerProofOfPlay[];
  trendHistory?: PerformanceTrendPoint[];
}

export interface EnrolmentRequest {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  userId: string;
  applicantName: string;
  ign: string;
  teamName: string;
  mode: 'solo' | 'squad';
  discordTag: string;
  contactNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  fileProofName?: string;
  fileProofUrl?: string; // Base64 data URL or preview
  submittedAt: string;
  adminNotes?: string;
}
