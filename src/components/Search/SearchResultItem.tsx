import {Box, Card, CardActionArea, CardActions, CardContent} from "@mui/material"

import {Button, Text} from "@bcgov/design-system-react-components";


interface SearchResultItemProps {
    title: string
    searchResultClickHandler: () => void
    assignClickHandler?: () => void

}

export function SearchResultItem({
                                     title,
                                     searchResultClickHandler,
                                     assignClickHandler,
                                 }: SearchResultItemProps) {

    const isAssignMode = !!assignClickHandler;

    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", display: "flex"}}>

                <CardActionArea onClick={searchResultClickHandler}>
                    <CardContent>
                        <Text size="large">{title}</Text>
                    </CardContent>
                </CardActionArea>

                {
                    isAssignMode &&
                    <CardActions>
                        <Button onPress={assignClickHandler}>Assign</Button>
                    </CardActions>
                }
            </Card>
        </Box>
    )
}
