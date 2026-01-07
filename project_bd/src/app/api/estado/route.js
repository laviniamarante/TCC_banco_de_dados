import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { nome_estado, uf, capital, nome_regiao } = await requisicao.json();

    if (!nome_estado || !uf || !capital || !nome_regiao) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO estado (nome_estado, uf, capital, nome_regiao)
       VALUES ($1, $2, $3, $4)`,
      [nome_estado, uf, capital, nome_regiao]
    );

    return NextResponse.json(
      { message: "Estado cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM estado ORDER BY id_estado ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
