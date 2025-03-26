import {Box, Card, CardActionArea, CardActions, CardContent} from "@mui/material"

import {Button, Text} from "@bcgov/design-system-react-components";


interface SearchResultItemProps {
    title: string
    searchResultClickHandler: () => void
    assignMode: boolean
    assignOfficeClickHandler: () => void
}

export function SearchResultItem({
                                     title,
                                     searchResultClickHandler,
                                     assignMode,
                                     assignOfficeClickHandler
                                 }: SearchResultItemProps) {
    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", display: "flex"}}>

                <CardActionArea onClick={assignMode ? undefined : searchResultClickHandler}
                                sx={{cursor: assignMode ? "default" : "pointer"}}>
                    <CardContent>
                        <Text size="large">{title}</Text>
                    </CardContent>
                </CardActionArea>

                {
                    assignMode &&
                    <CardActions>
                        <Button onPress={assignOfficeClickHandler}>Assign</Button>
                    </CardActions>
                }
            </Card>
        </Box>
    )
}
