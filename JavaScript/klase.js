class Krug {

    constructor(x ,y ,r ,boja){
        this.x = x;
        this.y = y;
        this.r = r;
        this.boja = boja;
        this.izabran = false;
        this.blokiran = false;
    }

    nacrtaj(ctx){
        ctx.fillStyle=this.boja;
        ctx.beginPath();
        ctx.arc(this.x ,this.y , this.r, 0, 2 * Math.PI);
        ctx.strokeStyle = this.boja;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    }

    update(ctx, boja){
        if(!this.blokiran){
            this.boja=boja;
        }
        this.nacrtaj(ctx);
    }

    nalazi_u(x,y){
        return Math.sqrt((this.x - x)*(this.x - x) + (this.y - y)*(this.y - y)) <= this.r + epsilon;
    }

}

class Linija {
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        if(Math.abs(x1 - x2) > epsilon)
            this.k = (y2-y1)/(x2-x1);
        else
            this.k = 'beskonacno';
        this.n = y1 - this.k*x1;
    }

    nacrtaj(ctx, boja, debljina_linije){
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = boja;
        ctx.lineWidth = debljina_linije;
        ctx.stroke();
    }

    sjece_liniju(linija){
    	let x, y;
        if(this.k === linija.k)
            return false
        if(this.k === 'beskonacno'){
            x = this.x1;
            y = linija.k * x + linija.n;
        }
        else if(linija.k === 'beskonacno'){
            x = linija.x1;
            y = this.k * x + this.n;
        }
        else{
            x = (linija.n - this.n) / (this.k - linija.k);
            y = this.k * x + this.n;
        }

        return (this.nalazi_u(x,y) && linija.nalazi_u(x,y));

    }

    sjece_krug(krug){
        let x1,x2,y1,y2,a,b,c,D;
        if(this.k === 'beskonacno'){
        	D = krug.r * krug.r - (this.x1 - krug.x)*(this.x1 - krug.x);
        	if(D < 0)
        		return false;
            y1 = krug.y + Math.sqrt(D);
            y2 = krug.y - Math.sqrt(D);
            x1 = this.x1;
            x2 = x1;
        }
        else{
            a = this.k * this.k + 1;
            b = 2 * this.k * this.n - 2 * krug.x - 2 * this.k * krug.y;
            c = krug.x * krug.x + krug.y  * krug.y - krug.r * krug.r - 2 * krug.y * this.n + this.n * this.n;
            D = b*b - 4*a*c;
            if(D < (-1 * epsilon))
                return false;
            x1 = (-1*b - Math.sqrt(D))/(2*a);
            y1 = this.k * x1 + this.n
            x2 = (-1*b + Math.sqrt(D))/(2*a);
            y2 = this.k * x2 + this.n
        }

        return (this.nalazi_u(x1,y1)) || (this.nalazi_u(x2,y2));


    }

    sjece_trokut(trokut){
        let l1 = new Linija(trokut.x1, trokut.y1, trokut.x2, trokut.y2);
        let l2 = new Linija(trokut.x1, trokut.y1, trokut.x3, trokut.y3);
        let l3 = new Linija(trokut.x2, trokut.y2, trokut.x3, trokut.y3);

        return (this.sjece_liniju(l1) || this.sjece_liniju(l2) || this.sjece_liniju(l3));

    }

    nalazi_u(x,y){

    	if(x == this.x1 && y == this.y1)
    		return true;
    	if(x == this.x2 && y == this.y2)
    		return true;
    	if(x == this.x3 && y == this.y3)
    		return true;

        let x1 = Math.max(this.x1, this.x2);
        let x2 = Math.min(this.x1, this.x2);
        let y1 = Math.max(this.y1, this.y2);
        let y2 = Math.min(this.y1, this.y2);

        if(this.k === 'beskonacno'){
            return (Math.abs(x - x1) < x1 && y < y1 + epsilon && y > y2 - epsilon)
        }
        if(Math.abs(this.k * x + this.n - y) > epsilon)
            return false;

        return (x < x1 + epsilon && x > x2 - epsilon && y < y1 + epsilon && y > y2 - epsilon);
    }


}

class Trokut {
    constructor(x1 ,y1 ,x2 ,y2 ,x3 ,y3 ,boja){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.boja = boja;
        this.povrsina = 1/2 * Math.abs(this.x1 * (this.y2 - this.y3) + this.x2 * (this.y3 - this.y1) + this.x3 * (this.y1 -this. y2));
    }

    nacrtaj(ctx){
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.lineTo(this.x1, this.y1);
        ctx.strokeStyle = this.boja;
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    nalazi_u(x,y){
        t1 = new Trokut(this.x1, this.y1, this.x2, this.y2, x, y);
        t2 = new Trokut(this.x1, this.y1, this.x3, this.y3, x, y);
        t3 = new Trokut(this.x2, this.y2, this.x3, this.y3, x, y);
        return Math.abs(this.povrsina - (t1.povrsina + t2.povrsina + t3.povrsina)) <= epsilon;

    }

    sjece_krug(krug){
        let l1 = new Linija(this.x1, this.y1, this.x2, this.y2);
        let l2 = new Linija(this.x1, this.y1, this.x3, this.y3);
        let l3 = new Linija(this.x2, this.y2, this.x3, this.y3);
        return (l1.sjece_krug(krug) || l2.sjece_krug(krug) || l3.sjece_krug(krug));

    }

    sjece_trokut(trokut){
        let l1 = new Linija(this.x1, this.y1, this.x2, this.y2);
        let l2 = new Linija(this.x1, this.y1, this.x3, this.y3);
        let l3 = new Linija(this.x2, this.y2, this.x3, this.y3);

        return (l1.sjece_trokut(trokut) || l2.sjece_trokut(trokut) || l3.sjece_trokut(trokut));

    }
}