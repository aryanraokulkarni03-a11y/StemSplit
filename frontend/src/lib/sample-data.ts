/**
 * Sample Demo Audio Files
 * 
 * These are placeholder paths for demo audio files.
 * In production, replace with actual audio file URLs.
 * 
 * Recommended format: MP3 or WAV
 * Recommended length: 30-60 seconds for demo
 */

export const DEMO_AUDIO = {
    vocal: '/demo/vocal.mp3',
    instrumental: '/demo/instrumental.mp3',
    full: '/demo/full.mp3',
};

/**
 * Sample Lyric Data
 * 
 * In production, this would come from:
 * - API endpoint (/api/lyrics/:songId)
 * - LRC file parser
 * - Third-party lyric service
 */

export interface LyricWord {
    text: string;
    startTime: number;
    endTime: number;
}

export interface LyricLine {
    startTime: number;
    endTime: number;
    text: string;
    translation?: string;
    words?: LyricWord[];
}

export const SAMPLE_LYRICS: LyricLine[] = [
    {
        startTime: 0,
        endTime: 3.5,
        text: 'Welcome to the AI Music Platform',
        translation: 'Bienvenue sur la plateforme musicale IA',
        words: [
            { text: 'Welcome', startTime: 0, endTime: 0.5 },
            { text: 'to', startTime: 0.5, endTime: 0.7 },
            { text: 'the', startTime: 0.7, endTime: 0.9 },
            { text: 'AI', startTime: 0.9, endTime: 1.3 },
            { text: 'Music', startTime: 1.3, endTime: 2.0 },
            { text: 'Platform', startTime: 2.0, endTime: 3.5 },
        ],
    },
    {
        startTime: 3.5,
        endTime: 7.0,
        text: 'Experience professional-grade stem separation',
        translation: 'Découvrez la séparation de stems de qualité professionnelle',
    },
    {
        startTime: 7.0,
        endTime: 10.5,
        text: 'With multi-device routing and real-time sync',
        translation: 'Avec routage multi-appareils et synchronisation en temps réel',
    },
    {
        startTime: 10.5,
        endTime: 14.0,
        text: 'Powered by advanced neural networks',
        translation: 'Propulsé par des réseaux neuronaux avancés',
    },
    {
        startTime: 14.0,
        endTime: 17.5,
        text: 'For musicians, producers, and creators',
        translation: 'Pour les musiciens, producteurs et créateurs',
    },
];
