using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BookListMVC.Models;
using Microsoft.EntityFrameworkCore;

namespace BookListMVC.Controllers
{
    public class BooksController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }
        [BindProperty]
        public Book Book { get; set; }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Upsert(int? id)
        {
            Book = new Book();
            if (id == null) // Create
                return View( Book);

            // Update
            Book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

            if (Book == null)
                return NotFound();


            return View(Book);
        }

        [HttpPost]
        public  IActionResult Upsert(Book Book)
        {
            if (ModelState.IsValid)
            {
                if(Book.Id == 0)
                {
                    // Create
                    _context.Books.Add(Book);
                }
                else
                {
                    _context.Books.Update(Book);
                }
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(Book);
        }

        #region API Calls

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Json(new {data = await _context.Books.ToListAsync() });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var bookFromDB = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (bookFromDB == null)
                return Json(new { success = false, message = "Cannot Find This book,please Reload the page and make sure its already exisits." });

            _context.Books.Remove(bookFromDB);
            _context.SaveChanges();
            return Json(new { success = true, message = "Delete Successfully."});
        }
        #endregion
    }
}