import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const {
      cnpj_cpf,
      ie,
      im,
      setor,
      email,
      role
    } = await requisicao.json();

    if (!cnpj_cpf || !ie || !im || !setor || !email || !role) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO pessoa
       (cnpj_cpf, ie, im, setor, email, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [cnpj_cpf, ie, im, setor, email, role]
    );

    return NextResponse.json(
      { message: "Pessoa cadastrada com sucesso." },
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
    const result = await pool.query(
      `SELECT * FROM pessoa ORDER BY id_pessoa`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(requisicao) {
  try {
    const { searchParams } = new URL(requisicao.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Informe o ID da pessoa para deletar." },
        { status: 400 }
      );
    }

    await pool.query(
      `DELETE FROM pessoa WHERE id_pessoa = $1`,
      [id]
    );

    return NextResponse.json(
      { message: "Pessoa deletada com sucesso." }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
