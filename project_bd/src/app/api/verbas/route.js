import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { valor_total, data_recebimento, descricao, origem } =
      await requisicao.json();

    if (!valor_total || !data_recebimento || !descricao || !origem) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO verbas 
       (valor_total, data_recebimento, descricao, origem)
       VALUES ($1, $2, $3, $4)`,
      [valor_total, data_recebimento, descricao, origem]
    );

    return NextResponse.json(
      { message: "Verba cadastrada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM verbas ORDER BY id_verbas ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM verbas ORDER BY id_verbas ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
