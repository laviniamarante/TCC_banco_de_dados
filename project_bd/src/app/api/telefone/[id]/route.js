import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, {params}) {
     const { id } = params;
    try{

        const result = await pool.query(`SELECT * FROM telefone WHERE id_telefone = $1`, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({error: "Registro não encontrado"}, {status:404});

        }

        return NextResponse.json(result.rows[0], { status: 200 });
    }   catch (error) {
        console.error("Erro ao buscar consultas.", error);
        return NextResponse.json(
        { message: "Erro ao buscar consultas." },
        { status: 500 }
    );
    }
}
