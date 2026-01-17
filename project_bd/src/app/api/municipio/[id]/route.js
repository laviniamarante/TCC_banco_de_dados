import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, {params}) {
    try{
        
        const { id } = await params;
        const result = await pool.query(`SELECT * FROM municipio WHERE id_municipio = $1`, [id]);

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
