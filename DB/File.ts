export default interface File{
  id:Number,
  folder_id:Number,
  user_id:String,
  fileName:String,
  extension:String|undefined,
  content:String|undefined  
}
