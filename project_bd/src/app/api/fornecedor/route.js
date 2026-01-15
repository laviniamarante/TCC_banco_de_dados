import { NextResponse } from "next/server";
import pool from "@/lib/db";
//linhas obrigatórias

export async function POST(requisicao) {
   const client = await pool.connect();
  
    try {
      const {
        cnpj_cpf,
        ie,
        im,
        setor,
        email,
        razao_social,
        nome_fantasia

      } = await requisicao.json();
  
      if (
        !cnpj_cpf ||
        !ie ||
        !im ||
        !setor ||
        !email ||
        !razao_social ||
        !nome_fantasia

      )  {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");


    const pessoaResult = await client.query(
      `INSERT INTO pessoa
       (cnpj_cpf, ie, im, setor, email, role)
       VALUES ($1,$2,$3,$4,$5,'fornecedor')
       RETURNING id_pessoa`,
      [cnpj_cpf, ie, im, setor, email]
    );

    const id_pessoa = pessoaResult.rows[0].id_pessoa;
        const fornecedordata = await client.query(
          `INSERT INTO fornecedor (id_pessoa, razao_social, nome_fantasia)
           VALUES ($1, $2, $3)`,
          [id_pessoa, razao_social, nome_fantasia]
        );
    
        await client.query("COMMIT");
    
        return NextResponse.json(
          { message: "Fornecedor cadastrado com sucesso.",
           status: 201, data: fornecedordata.rows[0]}
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
    
  export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, f.razao_social, f.nome_fantasia
      FROM pessoa p
      LEFT JOIN fornecedor f
        ON p.id_pessoa = f.id_pessoa
      ORDER BY p.id_pessoa ASC
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
    