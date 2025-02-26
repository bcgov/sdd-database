import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material"
import {Employee} from "@prisma/client";
// import {Employee, Office} from "@prisma/client";
import {getEmployeeFullName} from "@/utils";

interface SearchResultProps {
    employee: Employee;
    // item: Employee | Office;
    searchResultClickHandler: (employee: Employee) => void;
}

export function SearchResult({employee, searchResultClickHandler}: SearchResultProps) {
// export function SearchResult({item, searchResultClickHandler}: SearchResultProps) {
    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", cursor: "pointer"}}>
                {/*<CardActionArea onClick={() => searchResultClickHandler(item)}>*/}
                <CardActionArea onClick={() => searchResultClickHandler(employee)}>
                    <CardContent>
                        <Typography variant="h6">{getEmployeeFullName(employee)} ({employee.employee_id})</Typography>
                        {/*<Typography variant="h6">Test ()</Typography>*/}
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}