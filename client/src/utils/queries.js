//setup for React and Apollo
import { gpl } from '@apollo/client';

//setup for User data and saved book data (if any)
//loads in 'SavedBooks.js'
export const GET_ME = gpl`
    {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;