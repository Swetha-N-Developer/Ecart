class APIFeatures
{
    constructor(query,querystr)
    {
        //assign values to variables
        this.query = query;//query-product.find()
        this.querystr = querystr;//querystr-{keyword : "iphone"}
        //console.log(querystr);
    }

    

  
    search()
    {
        let keyword = this.querystr.keyword 
        ? 
        {
            /*
                this.querystr.keyword-iphone
                ternary operator
                this code searches only the following fields based on keyword in search box and also it  matches only exact keyword pattern
            */
            $or:[
                {
                     name : {
                        $regex : this.querystr.keyword,//regex is mongodb opereator it searches for matching string
                        $options : 'i'//incase sensitive of keyword value
                    }
                },
             {
                    description: {
                        $regex: this.querystr.keyword,
                        $options: 'i'
                    }
                },
                {
                    category: {
                        $regex: this.querystr.keyword,
                        $options: 'i'
                    }
                },
                {
                    seller: {
                        $regex: this.querystr.keyword,
                        $options: 'i'
                    }
                }
            ]
        
            } : {};//do not apply any search
//console.log(keyword);
            this.query.find({...keyword});
            //...keyword - copies the keyword object here.
            //this.query.find-product.find().find(condition) means it serarches the pattern from already fetched values
            return this;
            //if this code is not given we cannot include pagination and filtering methods further
    }

    //filer func for all fields in database including price
    filter()
    {
        //console.log('filter called');

        const queryStrCopy = {...this.querystr};
        //copies the query string object that contains url parameters

        //console.log(queryStrCopy);//before filter

        //remove the extra query parameters that not belongs to database fields
        //here we create an array for extra parameters that we want to remove
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);
        //foreach loops through an array and delete operator removes the property from object

        let querystr = JSON.stringify(queryStrCopy);
        //lt and lte these are the query operators.if we give price[lt] in url but mongodb accepts only $lte
        //so we  convert object into string to add $sign

        querystr = querystr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`);
        //query.replace - searches for string and replace it with somethingelse gt->$gte

        //console.log(querystr);//after remove fields

        this.query.find(JSON.parse(querystr));//parse-convert string to object
        //to use this parser we need to write (app.set('query parser', 'extended');) in app.js

        //console.log(querystr);//after remove fields

       // this.query.find(queryStrCopy);//it will fetch the data based on the query paramaeters

        return this;//used for method chainning of pagination and filter function 
    }

    paginate(resPerPage)//2
    {
       // console.log("pagination called");
        //console.log(this.querystr);

        const currentPage = Number(this.querystr.page) || 1;
        //querystr has the pagenumber in string so we convert it into string
        //1-if there is no page number in the url it will automatically set as page =1

        //console.log(currentPage);

        const skip = resPerPage * (currentPage-1);
        // suppose i have page number as3 in url it should skip page 1 and page2 content so we have skip variable here
        //if page number is 3 then skip=4 so it skips first four documents only displays from fifth document

        this.query.limit(resPerPage).skip(skip);
        //limit fun - set the limit perpage 
        //skip fun - skip the documents

        return this;
    }

}
module.exports = APIFeatures;
