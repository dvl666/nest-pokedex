/**
 * Para instalar mongoose, ejecutar el siguiente comando: npm i @nestjs/mongoose mongoose
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//Document es una interfaz de mongoose que nos permite definir la estructura de los documentos que se van a guardar en la base de datos
@Schema()
export class Pokemon extends Document {

    //id: number; -> mongoose se encarga de asignar el id 

    /**
     * `unique: true` para evitar duplicados.
     * `index: true` para optimizar las búsquedas por esta propiedad.
     */
    @Prop({
        unique: true,
        index: true
    })
    name: string;
    
    @Prop({
        unique: true,
        index: true
    })
    no: number;

}


/**
 * Utilizamos `SchemaFactory.createForClass()` para generar automáticamente 
 * el esquema de Mongoose basado en la clase `Pokemon` y sus decoradores.
 */
export const PokemonSchema = SchemaFactory.createForClass( Pokemon );
