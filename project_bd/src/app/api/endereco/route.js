import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const {
      descricao_logradouro,
      abreviacao_logradouro,
      id_municipio,
      id_pessoa
    } = await requisicao.json();

    if (
      !descricao_logradouro ||
      !abreviacao_logradouro ||
      !id_municipio ||
      !id_pessoa
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO endereco 
       (descricao_logradouro, abreviacao_logradouro, id_municipio, id_pessoa)
       VALUES ($1, $2, $3, $4)`,
      [
        descricao_logradouro,
        abreviacao_logradouro,
        id_municipio,
        id_pessoa
      ]
    );

    return NextResponse.json(
      { message: "Endereço cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        e.id_endereco,
        e.descricao_logradouro,
        e.abreviacao_logradouro,
        e.id_municipio,
        e.id_pessoa,
        p.cnpj_cpf,
        p.email,
        p.role
      FROM endereco e
      LEFT JOIN pessoa p
        ON e.id_pessoa = p.id_pessoa
      ORDER BY e.id_endereco ASC;
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
