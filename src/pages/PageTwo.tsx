import { Container } from '@mui/material'
import InputListCard from '../components/InputListCard'

function PageTwo() {
    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <InputListCard
                title="Einkaufsliste"
                description="Füge Artikel hinzu und markiere, was bereits im Einkaufswagen liegt."
                inputLabel="Neuer Artikel"
                buttonLabel="Artikel hinzufügen"
                initialItems={['Milch', 'Brot', 'Äpfel', 'Kaffee', 'Nudeln']}
            />
        </Container>
    )
}

export default PageTwo
