import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { numero } = await requisicao.json();

    if (!numero) {
      return NextResponse.json(
        { error: "Número é obrigatório." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO telefone (numero) VALUES ($1)`,
      [numero]
    );

    return NextResponse.json(
      { message: "Telefone cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM telefone ORDER BY id_telefone ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
