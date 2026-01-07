import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { data_pagamento, valor_pago, descricao, status } =
      await requisicao.json();

    if (!data_pagamento || !valor_pago || !descricao || !status) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO pagamento 
       (data_pagamento, valor_pago, descricao, status)
       VALUES ($1, $2, $3, $4)`,
      [data_pagamento, valor_pago, descricao, status]
    );

    return NextResponse.json(
      { message: "Pagamento cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM pagamento ORDER BY id_pagamentos ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
