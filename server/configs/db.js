import {neon} from '@neondatabase/serverless'

const sql = neon(`postgresql://neondb_owner:npg_5tYhb3ApKBym@ep-wispy-grass-a8lmwm8o-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require`);

export default sql;


