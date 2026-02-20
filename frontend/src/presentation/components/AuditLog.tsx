import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import type { ThreatDetection } from '../../domain/entities/ThreatDetection'

interface AuditLogProps {
  threats: ThreatDetection[]
}

export const AuditLog: React.FC<AuditLogProps> = ({ threats }) => {
  if (threats.length === 0) {
    return null
  }

  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #00ff00',
        borderRadius: '4px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#ff4444',
          fontFamily: 'monospace',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        [AUDIT LOG] - Threat Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {threats.map((threat, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: 'rgba(255, 68, 68, 0.1)',
              borderLeft: '3px solid #ff4444',
              fontFamily: 'monospace',
            }}
          >
            <Typography sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
              {threat.type}:
            </Typography>
            <Typography sx={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>
              {threat.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
