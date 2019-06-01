import { app } from './app';
import { startCreateMockDatabase } from "./lib/createMockDatabases";
import './startDatabase';

if(!process.env.PORT) startCreateMockDatabase();

app.listen(3030, () => console.log('Server is running on port 3030'));

 