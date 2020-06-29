import * as express from 'express';
import { makeApp } from './mocks';

const PORT = process.env.PORT || 3001;
const app = express();

makeApp(app);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
