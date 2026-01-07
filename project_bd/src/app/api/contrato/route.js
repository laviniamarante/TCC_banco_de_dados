import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {
  try {
    const {
      vigencia,
      status,
      valor_total,
      data_termino,
      data_inicio,
      descricao,
      numero
    } = await requisicao.json();

    if (
      !vigencia || !status || !valor_total ||
      !data_termino || !data_inicio ||
      !descricao || !numero
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO contrato 
       (vigencia, status, valor_total, data_termino, data_inicio, descricao, numero)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [vigencia, status, valor_total, data_termino, data_inicio, descricao, numero]
    );

    return NextResponse.json(
      { message: "Contrato cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM contrato ORDER BY id_contratos ASC;`);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
