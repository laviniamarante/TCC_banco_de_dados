import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  const client = await pool.connect();

  try {
    const {
      cnpj_cpf,
      ie,
      im,
      setor,
      email,
      matricula_siape
    } = await requisicao.json();

    if (
      !cnpj_cpf ||
      !ie ||
      !im ||
      !setor ||
      !email ||
      !matricula_siape
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");


    const pessoaResult = await client.query(
      `INSERT INTO pessoa
       (cnpj_cpf, ie, im, setor, email, role)
       VALUES ($1,$2,$3,$4,$5,'administrador')
       RETURNING id_pessoa`,
      [cnpj_cpf, ie, im, setor, email]
    );

    const id_pessoa = pessoaResult.rows[0].id_pessoa;
    const administradordata = await client.query(
      `INSERT INTO administrador (id_pessoa, matricula_siape)
       VALUES ($1, $2)`,
      [id_pessoa, matricula_siape]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Administrador cadastrado com sucesso.",
       status: 201, data: administradordata.rows[0]}
    );

  } catch (error) {
    await client.query("ROLLBACK");

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
export async function GET_ID(id) {
  try {
    const result = await pool.query(`
      SELECT p.*, a.matricula_siape
      FROM pessoa p
      LEFT JOIN administrador a 
        ON p.id_pessoa = a.id_pessoa
      WHERE a.id_administrador = $1
      ORDER BY p.id_pessoa
    `, [id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
