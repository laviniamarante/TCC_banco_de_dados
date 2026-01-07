import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const {
      descricao_logradouro,
      abreviacao_logradouro,
      id_municipio
    } = await requisicao.json();

    if (!descricao_logradouro || !abreviacao_logradouro || !id_municipio) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO endereco 
       (descricao_logradouro, abreviacao_logradouro, id_municipio)
       VALUES ($1, $2, $3)`,
      [descricao_logradouro, abreviacao_logradouro, id_municipio]
    );

    return NextResponse.json(
      { message: "Endereço cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM endereco ORDER BY id_endereco ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
