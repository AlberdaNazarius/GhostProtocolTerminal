import React, { useEffect, useRef, useMemo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useStream } from '../hooks/useStream'
import { TextRenderer } from '../view-models/TextRenderer'
import { AuditLog } from './AuditLog'
import type { StartStreamUseCase } from '../../application/use-cases/StartStreamUseCase'
import { ThreatDetection } from '../../domain/entities/ThreatDetection'

interface TerminalProps {
  startStreamUseCase: StartStreamUseCase
}

export const Terminal: React.FC<TerminalProps> = ({ startStreamUseCase }) => {
  const { displayText, threats, isStreaming, startStream, stopStream } = useStream(startStreamUseCase)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayText])

  const threatsArray = useMemo(() => {
    return Array.from(threats.entries()).map(([type, count]) => 
      new ThreatDetection(type as ThreatDetection['type'], count)
    )
  }, [threats])

  const renderTextWithRedactions = useMemo(() => {
    return TextRenderer.renderWithRedactions(displayText)
  }, [displayText])

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0a0a0a',
        color: '#00ff00',
        fontFamily: 'monospace',
        p: 3,
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            color: '#00ff00',
            fontFamily: 'monospace',
            textShadow: '0 0 10px #00ff00',
            letterSpacing: '3px',
          }}
        >
          [GHOST_PROTOCOL_TERMINAL]
        </Typography>
        <Button
          variant="contained"
          onClick={isStreaming ? stopStream : startStream}
          sx={{
            bgcolor: isStreaming ? '#ff4444' : '#00ff00',
            color: '#000',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: isStreaming ? '#cc0000' : '#00cc00',
            },
          }}
        >
          {isStreaming ? '[STOP STREAM]' : '[START INTERCEPT]'}
        </Button>
      </Box>

      <Box
        ref={terminalRef}
        sx={{
          flex: 1,
          bgcolor: '#000',
          border: '2px solid #00ff00',
          borderRadius: '4px',
          p: 2,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.1)',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#000',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#00ff00',
            borderRadius: '5px',
          },
        }}
      >
        {displayText ? (
          <Typography
            component="div"
            sx={{
              color: '#00ff00',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {renderTextWithRedactions}
            {isStreaming && (
              <span
                style={{
                  color: '#00ff00',
                  animation: 'blink 1s infinite',
                }}
              >
                ▊
              </span>
            )}
          </Typography>
        ) : (
          <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
            [AWAITING INTERCEPTION SIGNAL...]
            <br />
            Click [START INTERCEPT] to begin streaming intelligence data.
          </Typography>
        )}
      </Box>

      <AuditLog threats={threatsArray} />
    </Box>
  )
}
