import { Container } from '@mui/material'
import InputListCard from '../components/InputListCard'
import { useTranslation } from 'react-i18next';

function PageOne() {
    const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <InputListCard
        title={t("common.save")}
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
