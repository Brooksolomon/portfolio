import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

// Route segment config
export const alt = 'solocodes.dev Field Notes'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const supabase = await createClient()

  // Fetch blog
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, created_at, id')
    .eq('slug', slug)
    .single()

  const title = blog?.title || 'Field Notes - Classified Intel'
  const date = blog?.created_at ? new Date(blog.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  const shortId = blog?.id ? blog.id.substring(0, 8) : '40404040'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Background Grid Pattern - simulated SVG via linear-gradients */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.5,
          display: 'flex'
        }} />
        
        {/* Top Dark Bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '8px',
          backgroundColor: '#991b1b',
          display: 'flex'
        }} />

        {/* Top-Right Tag */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          display: 'flex',
          padding: '12px 24px',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          backgroundColor: 'rgba(153, 27, 27, 0.1)',
          color: 'rgba(239, 68, 68, 0.9)',
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          CASE #404: INTEL
        </div>

        {/* Main Content Box */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '40px',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* Metadata Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              <div style={{
                width: '12px', height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                marginRight: '12px',
              }} />
              Field Report
            </div>
            
            <div style={{
              display: 'flex',
              marginLeft: '24px',
              color: '#9ca3af',
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              {date}
            </div>

            <div style={{
              display: 'flex',
              marginLeft: 'auto',
              color: 'rgba(202, 138, 4, 0.8)',
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              ID: {shortId}
            </div>
          </div>
          
          {/* Title */}
          <div style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: '900',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f3f4f6',
            marginBottom: '60px',
            maxWidth: '960px',
          }}>
            {title}
          </div>

          {/* Bottom Branding */}
          <div style={{
             display: 'flex',
             alignItems: 'center',
             borderTop: '1px solid rgba(255,255,255,0.1)',
             paddingTop: '32px',
             marginTop: 'auto',
          }}>
             <div style={{
                fontSize: '24px',
                color: '#ef4444',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'flex',
             }}>
                solocodes.dev
             </div>
             <div style={{
                marginLeft: '16px',
                fontSize: '24px',
                color: '#6b7280',
                letterSpacing: '0.1em',
                display: 'flex',
             }}>
                /field-notes
             </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
