import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
      page_size: 100,
    });

    const data = response.results
      .map(page => {
        const dateProp = page.properties["作成日"];
        const totalProp = page.properties["合計"];

        if (!dateProp?.date || totalProp?.formula?.number == null) {
          return null;
        }

        return {
          date: dateProp.date.start,
          total: totalProp.formula.number,
        };
      })
      .filter(Boolean);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
