'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowRight, Music2, Zap, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/ProgressBar';
import { AudioFile } from '@/types/audio';

const FileUpload = dynamic(
  () => import('@/components/ui/FileUpload').then((mod) => mod.FileUpload),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto h-96 bg-zinc-900/50 animate-pulse border border-zinc-800 flex items-center justify-center">
        <span className="text-zinc-500 font-mono">LOADING UPLOADER...</span>
      </div>
    ),
  }
);

import { SkeuomorphicHero } from '@/components/ui/SkeuomorphicHero';

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((file: AudioFile) => {
    setSelectedFile(file);
  }, []);

  const handleStartProcessing = useCallback(async () => {
    if (selectedFile && selectedFile.file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile.file);

        // Upload directly to the FastAPI backend to avoid Vercel file system limits
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${backendUrl}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(errorText || 'Failed to upload file to server');
        }

        const data = await response.json();

        // Store file info (including backend inputPath) in sessionStorage for processing page
        sessionStorage.setItem('audioFile', JSON.stringify({
          name: data.fileName,
          inputPath: data.inputPath,
          duration: selectedFile.duration,
        }));

        // Navigate to processing page
        router.push('/process');
      } catch (err) {
        console.error('Upload failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload file. Please try again.';
        alert(errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
  }, [selectedFile, router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Skeuomorphic */}
      <SkeuomorphicHero />

      {/* Upload Section */}
      <section id="upload" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              Upload Your Audio
            </h2>

            <FileUpload onFileSelect={handleFileSelect} />

            {selectedFile && (
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={handleStartProcessing}
                  loading={isUploading}
                  disabled={isUploading}
                  icon={<ArrowRight className="w-5 h-5" />}
                  data-testid="start-processing-btn"
                >
                  {isUploading ? 'Preparing Engine...' : 'Start Processing'}
                </Button>
                <p className="text-sm text-foreground/50 mt-4">
                  Processing happens in your browser • Your files never leave your device
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-sky-400">StemSplit</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Quality</h3>
              <p className="text-foreground/60">
                Built on state-of-the-art Demucs model for professional-grade stem separation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Private</h3>
              <p className="text-foreground/60">
                All processing happens in your browser. Your audio files never leave your device.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <Download className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Free Forever</h3>
              <p className="text-foreground/60">
                No sign-up, no subscription, no limits. Use as much as you want, completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How It <span className="text-emerald-400">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload</h3>
              <p className="text-foreground/60">
                Drag and drop your MP3 or WAV file, or click to browse.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Process</h3>
              <p className="text-foreground/60">
                Our AI analyzes your audio and separates it into individual stems.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Download</h3>
              <p className="text-foreground/60">
                Preview each stem and download them individually or as a bundle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <Music2 className="w-16 h-16 text-sky-500 mx-auto mb-6 animate-float" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Split Your First Track?
            </h2>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              Join thousands of musicians, educators, and creators who use StemSplit for practice, learning, and remixing.
            </p>
            <Button
              size="lg"
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
