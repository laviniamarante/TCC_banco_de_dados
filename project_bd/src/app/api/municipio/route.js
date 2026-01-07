import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { nome_municipio, id_estado } = await requisicao.json();

    if (!nome_municipio || !id_estado) {
      return NextResponse.json(
        { error: "Nome do município e estado são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO municipio (nome_municipio, id_estado)
       VALUES ($1, $2)`,
      [nome_municipio, id_estado]
    );

    return NextResponse.json(
      { message: "Município cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM municipio ORDER BY id_municipio ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
