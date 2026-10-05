import { Box, Tooltip, Typography } from '@mui/material'
import { useGetInformationQuery } from '../../stores/information/InformationApi'

export default function BuildInfo() {
    const { data } = useGetInformationQuery()

    if (!data) {
        return null
    }

    const buildDate = new Date(data.buildDate).toLocaleString()

    return (
        <Box
            sx={{
                position: 'fixed',
                right: 8,
                bottom: 4,
                zIndex: (theme) => theme.zIndex.tooltip - 1,
                opacity: 0.5,
            }}
        >
            <Tooltip
                title={
                    <>
                        <div>Version: {data.version}</div>
                        <div>Commit: {data.commit}</div>
                        <div>Branch: {data.branch}</div>
                        <div>Build: {buildDate}</div>
                    </>
                }
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontSize: '0.65rem',
                        lineHeight: 1,
                        cursor: 'default',
                    }}
                >
                    {data.version}
                </Typography>
            </Tooltip>
        </Box>
    )
}
