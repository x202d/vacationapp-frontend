import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export interface ListEntry {
  id: number
  label: string
  checked: boolean
}

interface InputListCardProps {
  title: string
  description?: string
  inputLabel: string
  buttonLabel?: string
  initialItems: string[]
}

/**
 * Zeigt ein Eingabefeld mit Button zum Hinzufügen neuer Einträge,
 * sowie eine Liste mit Checkboxen davor.
 */
function InputListCard({
  title,
  description,
  inputLabel,
  buttonLabel = 'Hinzufügen',
  initialItems,
}: InputListCardProps) {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<ListEntry[]>(
    initialItems.map((label, index) => ({
      id: index,
      label,
      checked: false,
    })),
  )

  const handleAddItem = () => {
    const trimmed = inputValue.trim()
    if (trimmed === '') {
      return
    }

    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), label: trimmed, checked: false },
    ])
    setInputValue('')
  }

  const handleToggleItem = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddItem()
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          label={inputLabel}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {buttonLabel}
        </Button>
      </Stack>

      <Box
        sx={{
          bgcolor: 'background.default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <List dense>
          {items.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemIcon sx={{ minWidth: 40, pl: 1 }}>
                <Checkbox
                  edge="start"
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  textDecoration: item.checked ? 'line-through' : 'none',
                  color: item.checked ? 'text.secondary' : 'text.primary',
                }}
              />
            </ListItem>
          ))}
          {items.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Noch keine Einträge vorhanden."
                sx={{ color: 'text.secondary', fontStyle: 'italic' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Paper>
  )
}

export default InputListCard
