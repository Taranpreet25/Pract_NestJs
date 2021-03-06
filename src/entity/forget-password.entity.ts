import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("forget_password")

export class forget_password extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "email", length: 255 })
    email: string;

    @Column("varchar", { name: "token" ,nullable: true})
    token: string | null;

    @Column("timestamp with time zone", { name: "createTime" })
    createTime: Date;

    @Column("timestamp with time zone", { name: "updateTime" })
    updateTime: Date;

    @Column("int", { name: "is_used", default: () => "'0'" })
    is_used: number;

    async validateToken(token: string): Promise<boolean> {
        return token === this.token
    }
}