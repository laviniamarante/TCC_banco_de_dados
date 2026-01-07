import { NextResponse } from "next/server";
import pool from "@/lib/db";
//linhas obrigatórias

export async function POST(requisicao) {
  try {
    const { razao_social, nome_fantasia } = await requisicao.json();

    if (!razao_social || !nome_fantasia) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO fornecedor (id_pessoa, razao_social, nome_fantasia)
       VALUES ($1, $2, $3)`,
      [id_pessoa, razao_social, nome_fantasia]
    );

    return NextResponse.json(
      { message: "Fornecedor cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM fornecedor ORDER BY id_pessoa ASC;`);

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
