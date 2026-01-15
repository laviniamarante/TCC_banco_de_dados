import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const { numero, id_pessoa } = await requisicao.json();

    if (!numero) {
      return NextResponse.json(
        { error: "Número é obrigatório." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO telefone (numero, id_pessoa) VALUES ($1, $2)`,
      [numero, id_pessoa]
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
      SELECT 
        t.id_telefone,
        t.numero,
        t.id_pessoa,
        p.cnpj_cpf,
        p.email,
        p.role
      FROM telefone t
      LEFT JOIN pessoa p
        ON t.id_pessoa = p.id_pessoa
      ORDER BY t.id_telefone ASC;
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
