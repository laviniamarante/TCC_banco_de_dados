import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { nome, descricao } = await requisicao.json();

    if (!nome || !descricao) {
      return NextResponse.json(
        { error: "Nome e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO categoria (nome, descricao)
       VALUES ($1, $2)`,
      [nome, descricao]
    );

    return NextResponse.json(
      { message: "Categoria cadastrada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM categoria ORDER BY id_categoria ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
