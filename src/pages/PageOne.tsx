import { Container } from '@mui/material'
import InputListCard from '../components/InputListCard'

function PageOne() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <InputListCard
        title="Aufgabenliste"
        description="Trage eine neue Aufgabe ein und hake erledigte Punkte ab."
        inputLabel="Neue Aufgabe"
        buttonLabel="Aufgabe hinzufügen"
        initialItems={[
          'Einkaufsliste schreiben',
          'Projektbericht abschließen',
          'Termin beim Zahnarzt vereinbaren',
          'Wäsche waschen',
        ]}
      />
    </Container>
  )
}

export default PageOne
