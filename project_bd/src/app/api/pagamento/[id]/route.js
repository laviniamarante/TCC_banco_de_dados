import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const result = await pool.query(`SELECT * FROM pagamento WHERE id_pagamento = $1`, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({error: "Registro não encontrado"}, {status:404});

        }

        return NextResponse.json(result.json[0], {status:200});
    }   catch (error) {
        return NextResponse.json({error: error.message}, {status:500});
    }

}